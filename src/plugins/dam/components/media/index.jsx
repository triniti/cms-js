import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import swal from 'sweetalert2';

import { STATUS_FULFILLED, STATUS_PENDING } from '@triniti/app/constants';
import { Button, Card, CardBody, CardHeader, Loading, StatusMessage } from '@triniti/admin-ui-plugin/components';
import AssetLinkerModal from '@triniti/cms/plugins/dam/components/asset-linker-modal';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import Exception from '@gdbots/common/Exception';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import Message from '@gdbots/pbj/Message';
import ImageAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/image-asset/ImageAssetV1Mixin';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';

import LinkedAssetsGrid from './LinkedAssetsGrid';
import delegateFactory from './delegate';
import selector from './selector';

const imageType = ImageAssetV1Mixin.findOne().getCurie().getMessage();

class Media extends React.Component {
  static propTypes = {
    delegate: PropTypes.shape({
      handleClearChannel: PropTypes.func.isRequired,
      handleLinkAssets: PropTypes.func.isRequired,
      handleUnlinkAssets: PropTypes.func.isRequired,
      search: PropTypes.func.isRequired,
    }).isRequired,
    nodeRef: PropTypes.instanceOf(NodeRef).isRequired,
    searchNodesRequestState: PropTypes.shape({
      request: PropTypes.instanceOf(Message),
      response: PropTypes.instanceOf(Message),
      status: PropTypes.string,
      exception: PropTypes.instanceOf(Exception),
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
    };

    this.handleAssetsUploaded = this.handleAssetsUploaded.bind(this);
    this.handleLinkAssets = this.handleLinkAssets.bind(this);
    this.handleToggleModal = this.handleToggleModal.bind(this);
    this.handleUnlinkAsset = this.handleUnlinkAsset.bind(this);
  }

  componentDidMount() {
    const { delegate } = this.props;
    const { nodeRef, searchNodesRequestState } = this.props;
    const { request } = searchNodesRequestState;
    const nodeRefValue = nodeRef.valueOf();

    if (request && request.get('linked_ref') !== null && request.get('linked_ref').equals(nodeRefValue)) {
      return;
    }

    delegate.search();
  }

  componentWillUnmount() {
    const { delegate } = this.props;
    delegate.handleClearChannel();
  }

  handleToggleModal() {
    this.setState(({ isModalOpen }) => ({ isModalOpen: !isModalOpen }));
  }

  handleAssetsUploaded() {
    const { delegate } = this.props;
    delegate.search();
  }

  async handleLinkAssets(assets) {
    const { delegate } = this.props;
    try {
      await delegate.handleLinkAssets(assets);
      delegate.search();
    } catch (e) {
      // console.log('link assets failed', e);
    }
  }

  async handleUnlinkAsset(asset) {
    swal.fire({
      title: 'Are you sure?',
      text: `Do you want to unlink "${asset.get('title') || 'this image'}"?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, unlink!',
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
          await delegate.handleUnlinkAssets([NodeRef.fromNode(asset)]);
        } catch (e) {
          swal.fire('Failed', e.getMessage(), 'error');
        }

        delegate.search();
      }
    });
  }

  render() {
    const {
      nodeRef,
      searchNodesRequestState: { exception, response, status },
    } = this.props;

    if (exception) {
      return <StatusMessage status={status} exception={exception} />;
    }

    const { isModalOpen } = this.state;
    const nodes = (response && response.get('nodes')) || [];

    return (
      <Card>
        <CardHeader>
          Linked Images
          <Button onClick={this.handleToggleModal} className="mr-0 mt-2 mb-2">Link Images</Button>
        </CardHeader>
        <CardBody>
          <AssetLinkerModal
            assetTypes={[imageType]}
            isOpen={isModalOpen}
            nodeRef={nodeRef}
            onAssetUploaded={this.handleAssetsUploaded}
            onLinkAssets={this.handleLinkAssets}
            onToggleModal={this.handleToggleModal}
          />
          {nodes.length > 0
          && (
            <LinkedAssetsGrid
              nodes={nodes}
              onUnlinkAsset={this.handleUnlinkAsset}
            />
          )}
          {status === STATUS_PENDING && !nodes.length && <Loading />}
          {status === STATUS_FULFILLED && !nodes.length
          && <div className="not-found-message"><p>No linked images found.</p></div>}
        </CardBody>
      </Card>
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(Media);
