import isEqual from 'lodash/isEqual';
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
import toast from '@triniti/admin-ui-plugin/utils/toast';
import { STATUS_FULFILLED } from '@triniti/app/constants';

import delegateFactory from './delegate';
import getUpdatedItemSequenceNumbers from './getUpdatedItemSequenceNumbers';
import ResizeGallerySlider from './ResizeGallerySlider';
import selector from './selector';

import './styles.scss';

const MAX_IMAGES_PER_ROW = 11;
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
    items: PropTypes.arrayOf(PropTypes.shape({
      asset: PropTypes.instanceOf(Message),
      assetId: PropTypes.object,
      gallerySequence: PropTypes.number,
    })),
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
        isWaiting: false,
        itemsToUpdate: [],
      },
    };

    this.handleAddAssets = this.handleAddAssets.bind(this);
    this.handleAssetsUploaded = this.handleAssetsUploaded.bind(this);
    this.handleChangeSearchParam = this.handleChangeSearchParam.bind(this);
    this.handleDecreaseImagesPerRow = this.handleDecreaseImagesPerRow.bind(this);
    this.handleEditAsset = this.handleEditAsset.bind(this);
    this.handleEditSequence = this.handleEditSequence.bind(this);
    this.handleIncreaseImagesPerRow = this.handleIncreaseImagesPerRow.bind(this);
    this.handleRemoveAsset = this.handleRemoveAsset.bind(this);
    this.handleReorderGalleryAssets = this.handleReorderGalleryAssets.bind(this);
    this.handleSlideImagesPerRow = this.handleSlideImagesPerRow.bind(this);
    this.handleToggleCardOverlay = this.handleToggleCardOverlay.bind(this);
    this.handleToggleModal = this.handleToggleModal.bind(this);
  }

  componentDidMount() {
    const { delegate } = this.props;
    delegate.handleSearchGalleryAssets();
  }

  /**
   * check to make sure the nodes we get back from the search request have been set as expected and
   * if not, search again. necessary because sometimes we get notified that the reorder operation
   * is done but since the search is performed so quickly after the reorder "finishes", it may
   * bring in older versions of the assets.
   */
  componentDidUpdate({ items: prevItems }) {
    const { delegate, items } = this.props;
    const { reorder: { isWaiting, itemsToUpdate } } = this.state;
    if (isWaiting && !isEqual(prevItems, items)) {
      let isValid = true;
      const keys = Object.keys(itemsToUpdate);
      for (let i = 0; i < keys.length; i += 1) {
        const item = items.find((itm) => itm.assetId.toString() === keys[i]);
        if (item.gallerySequence !== itemsToUpdate[keys[i]]) {
          isValid = false;
          break;
        }
      }
      if (!isValid) {
        toast.show();
        delegate.handleSearchGalleryAssets();
      } else {
        toast.close();
        this.setState(() => ({ // eslint-disable-line react/no-did-update-set-state
          reorder: {
            isWaiting: false,
            itemsToUpdate: [],
          },
        }));
      }
    }
  }

  componentWillUnmount() {
    const { delegate } = this.props;
    delegate.handleClearChannel();
  }

  async handleAddAssets(assetMap) {
    const { delegate } = this.props;
    await delegate.handleAddGalleryAssets(assetMap);
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

  async handleEditSequence(asset, seqSet) {
    const { delegate } = this.props;

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

    if (gallerySeq) {
      try {
        await delegate.handleReorderGalleryAssets({ [asset.get('_id').toString()]: gallerySeq });
      } catch (e) {
        // did not update, should restore tab
      }

      delegate.handleSearchGalleryAssets();
    }
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

        try {
          await delegate.handleRemoveGalleryAsset(asset);
        } catch (e) {
          swal.fire('Failed', e.message, 'error');
        }

        delegate.handleSearchGalleryAssets();
      }
    });
  }

  async handleReorderGalleryAssets(oldIndex, newIndex) {
    const { delegate, items } = this.props;
    const itemsToUpdate = getUpdatedItemSequenceNumbers(oldIndex, newIndex, items);

    try {
      await delegate.handleReorderGalleryAssets(itemsToUpdate);
    } catch (e) {
      // did not update, should restore tab
    }

    this.setState(() => ({
      reorder: {
        isWaiting: true,
        itemsToUpdate,
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
    const { showGallerySequence } = this.state;
    const {
      isEditMode,
      isReorderGranted,
      items,
      nodeRef,
      searchNodesRequestState: { request, response, status },
    } = this.props;
    const { imagesPerRow, isModalOpen } = this.state;
    const lastGallerySequence = items.length ? items[0].gallerySequence : 0;

    const seqSet = new Set();
    const invalidSeqSet = new Set();
    items.forEach((item) => {
      if (seqSet.has(item.gallerySequence)) {
        invalidSeqSet.add(item.gallerySequence);
      } else {
        seqSet.add(item.gallerySequence);
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
                nodes={items.map((item) => item.asset)}
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
