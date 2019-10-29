import pickBy from 'lodash/pickBy';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import swal from 'sweetalert2';

import { Button, Card, Col, CardBody, CardHeader, CardFooter, Row } from '@triniti/admin-ui-plugin/components';
import AddGalleryAssetsModal from '@triniti/cms/plugins/dam/components/add-gallery-assets-modal';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import ImageAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/image-asset/ImageAssetV1Mixin';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import Pagination from '@triniti/cms/components/pagination';
import pbjUrl from '@gdbots/pbjx/pbjUrl';
import SortableGrid from '@triniti/cms/plugins/curator/components/sortable-grid';
import { STATUS_FULFILLED } from '@triniti/app/constants';

import delegateFactory from './delegate';
import getUpdatedItemSequenceNumbers from './getUpdatedItemSequenceNumbers';
import ResizeGallerySlider from './ResizeGallerySlider';
import selector from './selector';

import './styles.scss';

const MAX_IMAGES_PER_ROW = 11;
const MAX_ITEMS_TO_UPDATE_COUNT = 20;
const MIN_IMAGES_PER_ROW = 1;

const imageType = ImageAssetV1Mixin.findOne().getCurie().getMessage();

class GalleryMedia extends React.Component {
  static propTypes = {
    delegate: PropTypes.shape({
      handleClearChannel: PropTypes.func.isRequired,
      handleReorderGalleryAssets: PropTypes.func.isRequired,
      handleRemoveGalleryAsset: PropTypes.func.isRequired,
      handleSearchGalleryAssets: PropTypes.func.isRequired,
    }).isRequired,
    isEditMode: PropTypes.bool,
    isReorderGranted: PropTypes.bool,
    nodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
    nodeRef: PropTypes.instanceOf(NodeRef).isRequired,
    searchNodesRequestState: PropTypes.shape({
      request: PropTypes.instanceOf(Message),
      response: PropTypes.instanceOf(Message),
      status: PropTypes.string,
    }).isRequired,
  };

  static defaultProps = {
    isEditMode: false,
    isReorderGranted: false,
    items: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      imagesPerRow: 6,
      showGallerySequence: false,
      isModalOpen: false,
      reorder: {
        itemsToUpdate: null,
        nodes: [],
      },
    };

    this.handleAddAssets = this.handleAddAssets.bind(this);
    this.handleAssetsUploaded = this.handleAssetsUploaded.bind(this);
    this.handleChangeSearchParam = this.handleChangeSearchParam.bind(this);
    this.handleDecreaseImagesPerRow = this.handleDecreaseImagesPerRow.bind(this);
    this.handleEditAsset = this.handleEditAsset.bind(this);
    this.handleEditSequence = this.handleEditSequence.bind(this);
    this.handleIncreaseImagesPerRow = this.handleIncreaseImagesPerRow.bind(this);
    this.handleMoveNode = this.handleMoveNode.bind(this);
    this.handleRemoveAsset = this.handleRemoveAsset.bind(this);
    this.handleReorderGalleryAssets = this.handleReorderGalleryAssets.bind(this);
    this.handleSlideImagesPerRow = this.handleSlideImagesPerRow.bind(this);
    this.handleSubmitSortOrder = this.handleSubmitSortOrder.bind(this);
    this.handleToggleCardOverlay = this.handleToggleCardOverlay.bind(this);
    this.handleToggleModal = this.handleToggleModal.bind(this);
  }

  componentDidMount() {
    const { delegate } = this.props;
    delegate.handleSearchGalleryAssets();
  }

  componentDidUpdate({ nodes: prevNodes }) {
    const { nodes } = this.props;
    const { reorder: { itemsToUpdate } } = this.state;
    if ((prevNodes.length !== nodes.length) && itemsToUpdate) {
      const orderedNodes = nodes.map(node => node.clone());
      const gallerySeq = itemsToUpdate[id];
      let newOrderedNodes = [];

      Object.keys(itemsToUpdate).forEach(id => {
        const node = orderedNodes.find(item => item.get('_id').toString() === id);
        if (!node) {
          delete itemsToUpdate[id];
          return;
        }
        // move node based from the new gallery sequence
        newOrderedNodes = this.handleMoveNode(newOrderedNodes.length ? newOrderedNodes : orderedNodes, node, gallerySeq);
        node.set('gallery_seq', gallerySeq);
      });

      const newItemsToUpdate = pickBy(
        itemsToUpdate,
        (sequence, id) => nodes.findIndex(node => node.get('_id').toString() === id)
        !== newOrderedNodes.findIndex(node => node.get('_id').toString() === id)
      );

      const gallerySeqCount = Object.keys(newItemsToUpdate).length;
      this.setState({
        reorder: {
          itemsToUpdate: gallerySeqCount ? newItemsToUpdate : null,
          nodes: gallerySeqCount ? newOrderedNodes : [],
        },
      });
    }
  }

  componentWillUnmount() {
    const { delegate } = this.props;
    delegate.handleClearChannel();
  }

  async handleAddAssets(assetMap) {
    const { delegate } = this.props;
    await delegate.handleAddGalleryAssets(assetMap).catch(error => console.log(error));
    delegate.handleSearchGalleryAssets();

    return Promise.resolve();
  }

  handleEditAsset(asset) {
    swal.fire({
      title: 'Continue?',
      html: `Edit <b>"${asset.get('title') || 'this image'}"</b> will open a new tab.`,
      showCancelButton: true,
      confirmButtonText: 'Yes, continue!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn btn-secondary',
      imageUrl: damUrl(asset),
      imageHeight: 150,
      imageAlt: `${asset.get('title') || 'image'}`,
      reverseButtons: true,
    }).then(async (result) => {
      if (result.value) {
        const url = `${pbjUrl(asset, 'cms')}/edit`;
        window.open(url, '_blank');
      }
    });
  }

  /**
   * Create a copy of a new collection of nodes where the target node is moved based from the given gallery sequence.
   *
   * @param nodesToReorder
   * @param nodeToMove
   * @param gallerySeq
   * @return {[*]}
   */
  handleMoveNode(nodesToReorder, nodeToMove, gallerySeq) {
    const id = nodeToMove.get('_id').toString();
    const nodesCopy = [...nodesToReorder];

    const oldIndex = nodesCopy.findIndex(item => item.get('_id').toString() === id);
    if (oldIndex < 0) {
      // cannot find the node
      return nodesCopy;
    }

    const targetIndex = nodesCopy.findIndex(item => item.get('gallery_seq') <= gallerySeq);
    let newIndex = oldIndex < targetIndex ? targetIndex - 1 : targetIndex;
    newIndex = newIndex < 0 ? (nodesCopy.length - 1) : newIndex;

    nodesCopy.splice(newIndex, 0, nodesCopy.splice(oldIndex, 1)[0]);

    return nodesCopy;
  }

  async handleEditSequence(asset, seqSet) {
    const { value: gallerySeq } = await swal.fire({
      title: 'Enter new sequence number',
      input: 'text',
      inputValue: asset.get('gallery_seq'),
      inputValidator: (value) => {
        if (!value) {
          return 'Sequence number is empty!';
        }

        if (seqSet.has(Number.parseInt(value, 10))) {
          return `${value} is already in use`;
        }

        if (value < 0) {
          return 'Please use a positive number sequence!';
        }

        return false;
      },
      showLoaderOnConfirm: true,
      showCancelButton: true,
      confirmButtonText: 'Update',
      imageUrl: damUrl(asset),
      imageHeight: 150,
      imageAlt: `${asset.get('title') || 'image'}`,
      reverseButtons: true,
    });

    if (!gallerySeq) {
      return;
    }

    const { nodes } = this.props;
    const { reorder } = this.state;

    const gallerySeqNumber = parseInt(gallerySeq, 10);
    const itemsToUpdate = reorder.itemsToUpdate || {};
    const orderedNodes = reorder.nodes.length ? [...reorder.nodes] : nodes.map(node => node.clone());

    // move node based from the new gallery number
    const newOrderedNodes = this.handleMoveNode(orderedNodes, asset, gallerySeqNumber);

    // assign the new gallery sequence
    newOrderedNodes.find(node => node.get('_id').toString() === asset.get('_id').toString())
      .set('gallery_seq', gallerySeqNumber);

    const newItemsToUpdate = pickBy(
      { ...itemsToUpdate, ...{ [asset.get('_id').toString()]: gallerySeqNumber } },
      (sequence, id) => nodes.findIndex(node => node.get('_id').toString() === id)
      !== newOrderedNodes.findIndex(node => node.get('_id').toString() === id)
    );

    const gallerySeqCount = Object.keys(newItemsToUpdate).length;
    this.setState(() => ({
      reorder: {
        itemsToUpdate: gallerySeqCount ? newItemsToUpdate : null,
        nodes: newOrderedNodes,
      },
    }), () => {
      if (gallerySeqCount >= MAX_ITEMS_TO_UPDATE_COUNT) {
        this.handleSubmitSortOrder();
      }
    });
  }

  handleAssetsUploaded() {
    const { delegate } = this.props;
    delegate.handleSearchGalleryAssets();
  }

  async handleRemoveAsset(asset) {
    swal.fire({
      title: 'Are you sure?',
      html: `Do you want to remove <strong>"${asset.get('title') || 'this image'}"</strong>?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-danger',
      cancelButtonClass: 'btn btn-secondary',
      imageUrl: damUrl(asset),
      imageHeight: 150,
      imageAlt: `${asset.get('title') || 'image'}`,
      reverseButtons: true,
    }).then(async (result) => {
      if (result.value) {
        const { delegate } = this.props;
        await delegate.handleRemoveGalleryAsset(asset).catch(error => swal.fire('Failed', error.message, 'error'));
        delegate.handleSearchGalleryAssets();
      }
    });
  }

  handleReorderGalleryAssets({ oldIndex, newIndex }) {
    if (oldIndex === newIndex) {
      return;
    }
    const { nodes } = this.props;
    const { reorder } = this.state;
    const itemsToUpdate = reorder.itemsToUpdate || {};

    const reorderedNodes = reorder.nodes.length ? [...reorder.nodes] : nodes.map(node => node.clone());
    const items = reorderedNodes.map(node => ({
      assetId: node.get('_id').toString(),
      gallerySequence: itemsToUpdate[node.get('_id').toString()] || node.get('gallery_seq'),
    }));
    const updatedItemSequenceNumbers = getUpdatedItemSequenceNumbers(oldIndex, newIndex, items);
    Object.keys(updatedItemSequenceNumbers).forEach(id => reorderedNodes.find(node => node.get('_id').toString() === id)
      .set('gallery_seq', updatedItemSequenceNumbers[id]));

    reorderedNodes.splice(newIndex, 0, reorderedNodes.splice(oldIndex, 1)[0]);

    const newItemsToUpdate = pickBy(
      { ...itemsToUpdate, ...updatedItemSequenceNumbers },
      (sequence, id) => nodes.findIndex(node => node.get('_id').toString() === id)
      !== reorderedNodes.findIndex(node => node.get('_id').toString() === id)
    );

    const gallerySeqCount = Object.keys(newItemsToUpdate).length;
    this.setState(() => ({
      reorder: {
        nodes: reorderedNodes,
        itemsToUpdate: gallerySeqCount ? newItemsToUpdate : null,
      },
    }), () => {
      if (gallerySeqCount >= MAX_ITEMS_TO_UPDATE_COUNT) {
        this.handleSubmitSortOrder();
      }
    });
  }

  async handleSubmitSortOrder() {
    const { delegate } = this.props;
    const { reorder } = this.state;
    if (!reorder.itemsToUpdate) {
      return;
    }

    await delegate.handleReorderGalleryAssets(reorder.itemsToUpdate).catch(error => console.log(error));

    this.setState(() => ({
      reorder: {
        nodes: [],
        itemsToUpdate: null,
      },
    }), delegate.handleSearchGalleryAssets);
  }

  handleDecreaseImagesPerRow() {
    const { imagesPerRow } = this.state;
    if (imagesPerRow > MIN_IMAGES_PER_ROW) {
      this.setState({ imagesPerRow: imagesPerRow - 1 });
    }
  }

  handleIncreaseImagesPerRow() {
    const { imagesPerRow } = this.state;
    if (imagesPerRow < MAX_IMAGES_PER_ROW) {
      this.setState({ imagesPerRow: imagesPerRow + 1 });
    }
  }

  handleSlideImagesPerRow(e) {
    this.setState({
      imagesPerRow: parseFloat(e.target.value),
    });
  }

  handleChangeSearchParam(key, value) {
    const { delegate, searchNodesRequestState: { request } } = this.props;
    const newRequest = { ...request.toObject(), [key]: value };

    delete newRequest.request_id;
    delegate.handleSearchGalleryAssets(newRequest);
  }

  handleToggleModal() {
    this.setState(({ isModalOpen }) => ({ isModalOpen: !isModalOpen }));
  }

  handleToggleCardOverlay() {
    const { showGallerySequence } = this.state;
    this.setState({
      showGallerySequence: !showGallerySequence,
    });
  }

  render() {
    const { imagesPerRow, isModalOpen, reorder: { itemsToUpdate, nodes: reorderedNodes }, showGallerySequence } = this.state;
    const {
      isEditMode,
      isReorderGranted,
      nodes,
      nodeRef,
      searchNodesRequestState: { request, response, status },
    } = this.props;

    const items = reorderedNodes.length ? reorderedNodes : nodes;
    const lastGallerySequence = items.length ? items[0].get('gallery_seq') : 0;

    const seqSet = new Set();
    const invalidSeqSet = new Set();
    items.forEach(item => {
      const sequence = item.get('gallery_seq');
      if (seqSet.has(sequence)) {
        invalidSeqSet.add(sequence);
      } else {
        seqSet.add(sequence);
      }
    });

    return (
      <Card>
        <CardHeader>
          Images { items.length ? `(${items.length})` : ''}
          <ResizeGallerySlider
            imagesPerRow={imagesPerRow}
            maxImagesPerRow={MAX_IMAGES_PER_ROW}
            minImagesPerRow={MIN_IMAGES_PER_ROW}
            onDecreaseImagesPerRow={this.handleDecreaseImagesPerRow}
            onIncreaseImagesPerRow={this.handleIncreaseImagesPerRow}
            onSlideImagesPerRow={this.handleSlideImagesPerRow}
          />
          <Button disabled={!isEditMode} onClick={this.handleToggleModal} className="mr-0 mt-2 mb-2">Add Images</Button>
          <Button onClick={this.handleSubmitSortOrder} disabled={!itemsToUpdate} className="mr-0 mt-2 mb-2">Update Sort Order</Button>
        </CardHeader>
        <CardBody>
          <AddGalleryAssetsModal
            assetTypes={[imageType]}
            isOpen={isModalOpen}
            nodeRef={nodeRef}
            lastGallerySequence={lastGallerySequence}
            onAddAssets={this.handleAddAssets}
            onAssetsUploaded={this.handleAssetsUploaded}
            onToggleModal={this.handleToggleModal}
          />
          <Row gutter="sm">
            {items.length !== 0 && (
              <SortableGrid
                key={response ? response.get('created_at').toString() : `${Math.random()}`}
                imagesPerRow={imagesPerRow}
                invalidSeqSet={invalidSeqSet}
                isEditMode={isEditMode}
                nodes={items}
                onReorderGalleryAssets={this.handleReorderGalleryAssets}
                onEditAsset={this.handleEditAsset}
                onRemoveAsset={this.handleRemoveAsset}
                showEditSequence={showGallerySequence}
                onEditSequence={(asset) => this.handleEditSequence(asset, seqSet)}
              />
            )}
            {items.length === 0
            && <div className="not-found-message"><p>No images found.</p></div>}
          </Row>
        </CardBody>
        {status === STATUS_FULFILLED && (
          <CardFooter>
            <Row>
              <Col md="9">
                <Pagination
                  className="ml-3"
                  currentPage={request.get('page') || 1}
                  key="pager"
                  onChangePage={(nextPage) => this.handleChangeSearchParam('page', nextPage)}
                  perPage={request.get('count')}
                  total={response.get('total')}
                />
              </Col>
              {isReorderGranted && (
                <Col md="3">
                  <Button onClick={this.handleToggleCardOverlay}>
                    {showGallerySequence ? 'Hide' : 'Show'} Gallery Sequence
                  </Button>
                </Col>
              )}
            </Row>
          </CardFooter>
        )}
      </Card>
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(GalleryMedia);
