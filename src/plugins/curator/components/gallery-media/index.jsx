import pull from 'lodash/pull';
import pickBy from 'lodash/pickBy';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import swal from 'sweetalert2';
import { withRouter } from 'react-router';

import { Button, Card, Col, CardBody, CardHeader, CardFooter, Row } from '@triniti/admin-ui-plugin/components';
import AddGalleryAssetsModal from '@triniti/cms/plugins/dam/components/add-gallery-assets-modal';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import Exception from '@gdbots/common/Exception';
import ImageAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/image-asset/ImageAssetV1Mixin';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import Pagination from '@triniti/cms/components/pagination';
import pbjUrl from '@gdbots/pbjx/pbjUrl';
import SortableGrid from '@triniti/cms/plugins/curator/components/sortable-grid';
import { STATUS_FULFILLED } from '@triniti/app/constants';
import BatchEditButton from '@triniti/cms/plugins/dam/components/batch-edit-button';

import delegateFactory from './delegate';
import getUpdatedNodeSequenceNumbers from './utils/getUpdatedNodeSequenceNumbers';
import moveNodeByGallerySequence from './utils/moveNodeByGallerySequence';
import moveNodeByIndex from './utils/moveNodeByIndex';
import ResizeGallerySlider from './ResizeGallerySlider';
import selector from './selector';

const MAX_IMAGES_PER_ROW = 11;
const MIN_IMAGES_PER_ROW = 1;
const MAX_NODES_COUNT_TO_UPDATE = 30;

const imageType = ImageAssetV1Mixin.findOne().getCurie().getMessage();

class GalleryMedia extends React.Component {
  static propTypes = {
    delegate: PropTypes.shape({
      handleClearChannel: PropTypes.func.isRequired,
      handleReorderGalleryAssets: PropTypes.func.isRequired,
      handleRemoveGalleryAsset: PropTypes.func.isRequired,
      handleSearchGalleryAssets: PropTypes.func.isRequired,
    }).isRequired,
    history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    isEditMode: PropTypes.bool,
    isReorderGranted: PropTypes.bool,
    nodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
    nodeRef: PropTypes.instanceOf(NodeRef).isRequired,
    patchAssetsCommandState: PropTypes.shape({
      command: PropTypes.instanceOf(Message),
      exception: PropTypes.instanceOf(Exception),
      status: PropTypes.string,
    }).isRequired,
    searchNodesRequestState: PropTypes.shape({
      request: PropTypes.instanceOf(Message),
      response: PropTypes.instanceOf(Message),
      status: PropTypes.string,
    }).isRequired,
  };

  static defaultProps = {
    isEditMode: false,
    isReorderGranted: false,
    nodes: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      imagesPerRow: 6,
      selected: [],
      showGallerySequence: false,
      isModalOpen: false,
      reorder: {
        nodes: [],
        nodesToUpdate: null,
      },
    };

    this.handleAddAssets = this.handleAddAssets.bind(this);
    this.handleAssetsUploaded = this.handleAssetsUploaded.bind(this);
    this.handleChangeSearchParam = this.handleChangeSearchParam.bind(this);
    this.handleClearSelectedAssets = this.handleClearSelectedAssets.bind(this);
    this.handleDecreaseImagesPerRow = this.handleDecreaseImagesPerRow.bind(this);
    this.handleEditAsset = this.handleEditAsset.bind(this);
    this.handleEditSequence = this.handleEditSequence.bind(this);
    this.handleIncreaseImagesPerRow = this.handleIncreaseImagesPerRow.bind(this);
    this.handleRemoveAsset = this.handleRemoveAsset.bind(this);
    this.handleReorderGalleryAssets = this.handleReorderGalleryAssets.bind(this);
    this.handleReorderOnGalleryChanged = this.handleReorderOnGalleryChanged.bind(this);
    this.handleSlideImagesPerRow = this.handleSlideImagesPerRow.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSubmitReorder = this.handleSubmitReorder.bind(this);
    this.handleToggleCardOverlay = this.handleToggleCardOverlay.bind(this);
    this.handleToggleModal = this.handleToggleModal.bind(this);
  }

  componentDidMount() {
    const { delegate, history } = this.props;
    delegate.handleSearchGalleryAssets();
    this.unblock = history.block((location, action) => {
      const { reorder } = this.state;
      const { nodes } = this.props;
      const movedNodes = pickBy(
        reorder.nodesToUpdate || {},
        (sequence, id) => nodes.findIndex((node) => node.get('_id').toString() === id)
          !== reorder.nodes.findIndex((node) => node.get('_id').toString() === id),
      );
      if (Object.keys(movedNodes).length) {
        return 'You have unsaved changes. Are you sure you want to leave?';
      }
      return true;
    });
  }

  componentDidUpdate({ nodes: prevNodes, patchAssetsCommandState: prevPatchAssetsCommandState }) {
    const { nodes, patchAssetsCommandState } = this.props;
    const { reorder: { nodesToUpdate }, selected } = this.state;

    if ((prevNodes.length !== nodes.length) && nodesToUpdate) {
      this.handleReorderOnGalleryChanged();
    }

    if (selected.length
      && patchAssetsCommandState.status === STATUS_FULFILLED
      && prevPatchAssetsCommandState.command.get('command_id')
      !== patchAssetsCommandState.command.get('command_id')) {
      this.handleClearSelectedAssets();
    }
  }

  componentWillUnmount() {
    this.unblock();
    const { delegate } = this.props;
    delegate.handleClearChannel();
  }

  async handleAddAssets(assetMap) {
    const { delegate } = this.props;
    try {
      await delegate.handleAddGalleryAssets(assetMap);
    } catch (e) {
      // did not update, should restore tab
    }
    delegate.handleSearchGalleryAssets();
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
    const nodesToUpdate = reorder.nodesToUpdate || {};
    const clonedNodes = reorder.nodes.length ? reorder.nodes.slice()
      : nodes.map((node) => node.clone());
    const reorderedNodes = moveNodeByGallerySequence(gallerySeqNumber, asset, clonedNodes);

    reorderedNodes
      .find((node) => node.get('_id').toString() === asset.get('_id').toString())
      .set('gallery_seq', gallerySeqNumber);

    const newNodesToUpdate = pickBy(
      { ...nodesToUpdate, ...{ [asset.get('_id').toString()]: gallerySeqNumber } },
      (sequence, id) => nodes.find((node) => node.get('_id').toString() === id).get('gallery_seq')
      !== reorderedNodes.find((node) => node.get('_id').toString() === id).get('gallery_seq'),
    );

    const nodesToUpdateCount = Object.keys(newNodesToUpdate).length;
    this.setState(() => ({
      reorder: {
        nodes: reorderedNodes,
        nodesToUpdate: nodesToUpdateCount ? newNodesToUpdate : null,
      },
    }), () => {
      if (nodesToUpdateCount < MAX_NODES_COUNT_TO_UPDATE) {
        return;
      }
      this.handleSubmitReorder();
    });
  }

  handleAssetsUploaded() {
    const { delegate } = this.props;
    delegate.handleSearchGalleryAssets();
  }

  async handleRemoveAsset(asset) {
    const { value } = await swal.fire({
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
    });

    if (!value) {
      return;
    }
    const { delegate } = this.props;
    const { selected } = this.state;
    try {
      this.setState({ selected: pull(selected, asset.get('_id').toNodeRef().toString()) });
      await delegate.handleRemoveGalleryAsset(asset);
    } catch (error) {
      await swal.fire('Failed', error.message, 'error');
    }
    delegate.handleSearchGalleryAssets();
  }

  handleReorderGalleryAssets({ oldIndex, newIndex }) {
    if (oldIndex === newIndex) {
      return;
    }
    const { nodes } = this.props;
    const { reorder } = this.state;
    const nodesToUpdate = reorder.nodesToUpdate || {};
    const clonedNodes = reorder.nodes.length ? reorder.nodes.slice()
      : nodes.map((node) => node.clone());
    const updatedNodeSequenceNumbers = getUpdatedNodeSequenceNumbers(
      oldIndex,
      newIndex,
      clonedNodes,
    );
    const reorderedNodes = moveNodeByIndex(oldIndex, newIndex, clonedNodes);

    Object.keys(updatedNodeSequenceNumbers)
      .forEach((id) => reorderedNodes.find((node) => node.get('_id').toString() === id)
        .set('gallery_seq', updatedNodeSequenceNumbers[id]));

    const newNodesToUpdate = pickBy(
      { ...nodesToUpdate, ...updatedNodeSequenceNumbers },
      (sequence, id) => nodes.find((node) => node.get('_id').toString() === id).get('gallery_seq')
      !== reorderedNodes.find((node) => node.get('_id').toString() === id).get('gallery_seq'),
    );
    const nodesToUpdateCount = Object.keys(newNodesToUpdate).length;
    this.setState(() => ({
      reorder: {
        nodes: reorderedNodes,
        nodesToUpdate: nodesToUpdateCount ? newNodesToUpdate : null,
      },
    }), () => {
      if (nodesToUpdateCount < MAX_NODES_COUNT_TO_UPDATE) {
        return;
      }
      this.handleSubmitReorder();
    });
  }

  /**
   * This will preserve and rebuild the gallery based from
   * the unsaved gallery reorder changes that the user has made.
   * One such use case here is when a user edit a whole bunch of
   * sequences, reorder multiple images, and adds/delete an image.
   */
  handleReorderOnGalleryChanged() {
    const { nodes } = this.props;
    const { reorder: { nodesToUpdate } } = this.state;

    const clonedNodes = nodes.map((node) => node.clone());
    let reorderedNodes = [];

    Object.keys(nodesToUpdate).forEach((id) => {
      const gallerySeq = nodesToUpdate[id];
      const clonedNode = clonedNodes.find((item) => item.get('_id').toString() === id);
      if (!clonedNode) {
        delete nodesToUpdate[id];
        return;
      }
      reorderedNodes = moveNodeByGallerySequence(
        gallerySeq,
        clonedNode,
        !reorderedNodes.length ? clonedNodes : reorderedNodes,
      );
      clonedNode.set('gallery_seq', gallerySeq);
    });

    const newNodesToUpdate = pickBy(
      nodesToUpdate,
      (sequence, id) => nodes.find((node) => node.get('_id').toString() === id).get('gallery_seq')
      !== reorderedNodes.find((node) => node.get('_id').toString() === id).get('gallery_seq'),
    );
    const nodesToUpdateCount = Object.keys(newNodesToUpdate).length;
    this.setState({
      reorder: {
        nodes: nodesToUpdateCount ? reorderedNodes : [],
        nodesToUpdate: nodesToUpdateCount ? newNodesToUpdate : null,
      },
    });
  }

  async handleSubmitReorder() {
    const { delegate } = this.props;
    const { reorder } = this.state;
    if (!reorder.nodesToUpdate) {
      return;
    }

    try {
      await delegate.handleReorderGalleryAssets(reorder.nodesToUpdate);
    } catch (error) {
      // did not reordered
    }

    delegate.handleSearchGalleryAssets();
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

  handleClearSelectedAssets() {
    this.setState({
      selected: [],
    });
  }

  handleSelect(node) {
    const nodeRefId = node.get('_id').toNodeRef().toString();
    this.setState(({ selected }) => {
      if (selected.indexOf(nodeRefId) === -1) {
        selected.push(nodeRefId);
        return { selected };
      }
      return { selected: pull(selected, nodeRefId) };
    });
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
    const {
      imagesPerRow,
      isModalOpen,
      reorder: { nodes: reorderedNodes, nodesToUpdate },
      selected,
      showGallerySequence,
    } = this.state;

    const {
      isEditMode,
      isReorderGranted,
      nodes: orderedNodes,
      nodeRef,
      searchNodesRequestState: { request, response, status },
    } = this.props;

    const nodes = reorderedNodes.length ? reorderedNodes : orderedNodes;
    const lastGallerySequence = nodes.length ? nodes[0].get('gallery_seq') : 0;

    const seqSet = new Set();
    const invalidSeqSet = new Set();
    nodes.forEach((node) => {
      const sequence = node.get('gallery_seq');
      if (seqSet.has(sequence)) {
        invalidSeqSet.add(sequence);
      } else {
        seqSet.add(sequence);
      }
    });

    const movedNodes = pickBy(
      nodesToUpdate || {},
      (sequence, id) => orderedNodes.findIndex((node) => node.get('_id').toString() === id)
       !== reorderedNodes.findIndex((node) => node.get('_id').toString() === id),
    );
    const movedNodesCount = Object.keys(movedNodes).length;

    return (
      <Card>
        <CardHeader>
          <span className="pr-4" style={{ minWidth: '130px' }}>Images { nodes.length ? `(${nodes.length})` : ''}</span>
          <ResizeGallerySlider
            imagesPerRow={imagesPerRow}
            maxImagesPerRow={MAX_IMAGES_PER_ROW}
            minImagesPerRow={MIN_IMAGES_PER_ROW}
            onDecreaseImagesPerRow={this.handleDecreaseImagesPerRow}
            onIncreaseImagesPerRow={this.handleIncreaseImagesPerRow}
            onSlideImagesPerRow={this.handleSlideImagesPerRow}
          />

          <div className="d-inline-flex flex-wrap justify-content-end ml-2 my-1">
            <BatchEditButton
              assetIds={selected}
              className="mt-2 mb-2"
              isEditMode={isEditMode}
              nodeRef={nodeRef}
            />
            <Button
              disabled={!isEditMode}
              onClick={this.handleToggleModal}
              className="mt-2 mb-2"
            >
              Add Images
            </Button>
            <Button
              onClick={this.handleSubmitReorder}
              disabled={!movedNodesCount}
              className="mt-2 mb-2"
            >
              Reorder Images
              {movedNodesCount ? <span className="badge badge-danger badge-alert">{Object.keys(nodesToUpdate || {}).length}</span> : null}
            </Button>
          </div>
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
            {nodes.length !== 0 && (
              <SortableGrid
                key={response ? response.get('created_at').toString() : `${Math.random()}`}
                imagesPerRow={imagesPerRow}
                invalidSeqSet={invalidSeqSet}
                isEditMode={isEditMode}
                multiSelect
                nodes={nodes}
                onReorderGalleryAssets={this.handleReorderGalleryAssets}
                onEditAsset={this.handleEditAsset}
                onRemoveAsset={this.handleRemoveAsset}
                onSelect={this.handleSelect}
                selected={selected}
                showEditSequence={showGallerySequence}
                onEditSequence={(asset) => this.handleEditSequence(asset, seqSet)}
              />
            )}
            {nodes.length === 0
            && <div className="not-found-message"><p>No images found.</p></div>}
          </Row>
        </CardBody>
        {status === STATUS_FULFILLED && (
          <CardFooter>
            <Row>
              <Col md="9">
                <Pagination
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

export default withRouter(connect(selector, createDelegateFactory(delegateFactory))(GalleryMedia));
