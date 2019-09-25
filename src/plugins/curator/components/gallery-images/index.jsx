import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import ImageGrid from '@triniti/cms/plugins/dam/components/image-grid';
import Message from '@gdbots/pbj/Message';
import MessageRef from '@gdbots/pbj/MessageRef';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import {
  Button,
  Container,
  Form,
  Icon,
  Input,
  InputGroup,
  InputGroupAddon,
  ScrollableContainer,
} from '@triniti/admin-ui-plugin/components';
import delegateFactory from './delegate';
import selector from './selector';

class GalleryImages extends React.Component {
  static propTypes = {
    galleryNode: PropTypes.instanceOf(Message).isRequired,
    innerRef: PropTypes.func,
    onSelectImage: PropTypes.func.isRequired,
    requestRef: PropTypes.instanceOf(MessageRef),
    searchResults: PropTypes.arrayOf(PropTypes.object),
    selectedImage: PropTypes.instanceOf(Message),
    delegate: PropTypes.shape({
      handleSearch: PropTypes.func.isRequired,
      handleClearChannel: PropTypes.func.isRequired,
    }).isRequired,
    searchNodesRequestState: PropTypes.shape({
      response: PropTypes.object,
      status: PropTypes.string,
    }).isRequired,
  };

  static defaultProps = {
    innerRef: noop,
    requestRef: null,
    searchResults: [],
    selectedImage: null,
  };

  constructor(props) {
    super(props);
    this.state = { q: '' };
    this.handleChangeQ = this.handleChangeQ.bind(this);
  }

  componentDidMount() {
    const { delegate, galleryNode, requestRef, searchNodesRequestState } = this.props;
    const { response } = searchNodesRequestState;
    const nodeRef = NodeRef.fromNode(galleryNode);

    if (requestRef !== nodeRef) {
      delegate.handleClearChannel();
    }

    if (response === null || requestRef !== nodeRef) {
      delegate.handleSearch(nodeRef);
    }
  }

  componentWillUnmount() {
    const { delegate } = this.props;
    delegate.handleClearChannel();
  }

  handleChangeQ(event) {
    const { delegate, galleryNode } = this.props;
    this.setState({ q: event.target.value }, () => {
      const { q } = this.state;
      delegate.handleSearch(NodeRef.fromNode(galleryNode), q);
    });
  }

  render() {
    const { onSelectImage, searchResults, innerRef, selectedImage } = this.props;
    const { q } = this.state;

    return [
      <Container fluid className="sticky-top bg-white px-4 py-2 shadow-depth-2" key="form">
        <Form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
          <InputGroup size="sm">
            <Input
              className="form-control"
              innerRef={innerRef}
              name="q"
              onChange={this.handleChangeQ}
              placeholder="search images within the gallery.."
              type="search"
              value={q}
            />
            <InputGroupAddon addonType="append">
              <Button color="secondary">
                <Icon imgSrc="search" className="mr-0" />
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </Form>
      </Container>,
      <ScrollableContainer
        className="bg-gray-400"
        key="results"
        style={{ height: 'calc(100vh - 212px)' }}
      >
        {searchResults.length
          ? (
            <ImageGrid
              images={searchResults}
              onSelectImage={onSelectImage}
              selectedImages={selectedImage ? [selectedImage] : []}
            />
          )
          : (
            <div className="not-found-message">
              <p>No images found in the gallery that match your search.</p>
            </div>
          )}
      </ScrollableContainer>,
    ];
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(GalleryImages);
