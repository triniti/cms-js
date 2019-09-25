import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import noop from 'lodash/noop';

import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import {
  BackgroundImage,
  Button,
  Card,
  CardImgOverlay,
  CardTitle,
  Col,
  Container,
  Icon,
  Media,
  Row,
} from '@triniti/admin-ui-plugin/components';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import ImageAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/image-asset/ImageAssetV1Mixin';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import delegateFactory from './delegate';
import selector from './selector';

const imageType = ImageAssetV1Mixin.findOne().getCurie().getMessage();

class LinkedImages extends React.Component {
  static propTypes = {
    assetTypes: PropTypes.arrayOf(PropTypes.string),
    delegate: PropTypes.shape({
      handleSearch: PropTypes.func.isRequired,
      clearPbjxChannel: PropTypes.func.isRequired,
    }).isRequired,
    node: PropTypes.instanceOf(Message).isRequired,
    onSelectImage: PropTypes.func.isRequired,
    onSwitchTabs: PropTypes.func,
    onToggleUploader: PropTypes.func.isRequired,
    refreshSearch: PropTypes.number,
    requestRef: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    searchNodesRequestState: PropTypes.shape({
      response: PropTypes.object,
      status: PropTypes.string,
    }).isRequired,
    searchResults: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    assetTypes: [imageType],
    onSwitchTabs: noop,
    refreshSearch: 0,
    requestRef: null,
    searchResults: [],
  };

  constructor(props) {
    super(props);
    this.handleLinkedAssetSearch = this.handleLinkedAssetSearch.bind(this);
  }

  // Fixme: Move to classy delegate once linked-images/delegate.js has been converted
  componentDidMount() {
    const { delegate, node, requestRef, searchNodesRequestState } = this.props;
    const { response } = searchNodesRequestState;
    const nodeRef = NodeRef.fromNode(node);

    if (requestRef !== nodeRef) {
      delegate.clearPbjxChannel();
    }
    if (response === null || requestRef !== nodeRef) {
      this.handleLinkedAssetSearch();
    }
  }

  UNSAFE_componentWillReceiveProps({ refreshSearch: nextRefreshSearch }) {
    const { refreshSearch: currentRefreshSearch } = this.props;
    if (nextRefreshSearch !== currentRefreshSearch) {
      this.handleLinkedAssetSearch();
    }
  }

  componentWillUnmount() {
    const { delegate } = this.props;
    delegate.clearPbjxChannel();
  }

  handleLinkedAssetSearch(page = 1) {
    const { delegate, node, assetTypes } = this.props;
    const nodeRef = NodeRef.fromNode(node);
    delegate.handleSearch('', page, nodeRef, assetTypes);
  }

  render() {
    const {
      onSelectImage,
      onSwitchTabs,
      onToggleUploader: handleToggleUploader,
      searchResults,
    } = this.props;

    return (
      searchResults.length
        ? (
          <Container fluid className="gallery-grid-container">
            <Row gutter="sm" className="m-0">
              {searchResults.map((asset) => (
                <Col xs="12" sm="6" md="4" lg="3" xl="2p" key={asset.get('_id').toString()}>
                  <Card
                    shadow
                    inverse
                    hoverBorder
                    onClick={() => onSelectImage(asset)}
                    role="presentation"
                    className="p-2"
                  >
                    <Media aspectRatio="1by1" className="mt-0">
                      <BackgroundImage
                        imgSrc={damUrl(asset, 'o', 'sm')}
                        alt="thumbnail"
                      />
                      <CardImgOverlay>
                        <CardTitle className="h5 mb-0">{asset.get('title')}</CardTitle>
                      </CardImgOverlay>
                    </Media>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        )
        : (
          <div className="not-found-message">
            <p>
              No linked images found. You can
              <Button
                className="ml-1 mr-1"
                onClick={handleToggleUploader}
                size="sm"
                style={{ marginBottom: '3px' }}
                outlineText
                color="primary"
              ><Icon imgSrc="upload" size="xs" className="mr-1" />upload
              </Button> new images or
              <Button
                className="ml-1 mr-1"
                onClick={() => onSwitchTabs('search-media')}
                size="sm"
                style={{ marginBottom: '3px' }}
                outlineText
                color="primary"
              ><Icon imgSrc="search" size="xs" className="mr-1" />search
              </Button> to find unlink images.
            </p>
          </div>
        )
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(LinkedImages);
