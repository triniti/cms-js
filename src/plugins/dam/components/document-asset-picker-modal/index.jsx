import PropTypes from 'prop-types';
import React from 'react';
import noop from 'lodash/noop';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import { connect } from 'react-redux';
import Message from '@gdbots/pbj/Message';
import Uploader from '@triniti/cms/plugins/dam/components/uploader';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ScrollableContainer,
  Icon,
  Input,
  InputGroup,
  InputGroupAddon,
  Spinner,
} from '@triniti/admin-ui-plugin/components';
import DocumentAssetsTable from '@triniti/cms/plugins/dam/components/document-assets-table';
import delegateFactory from './delegate';
import selector from './selector';

class DocumentAssetPickerModal extends React.Component {
  static propTypes = {
    delegate: PropTypes.shape({
      handleClearDocumentAssetChannel: PropTypes.func.isRequired,
      handleSearchDocumentAssets: PropTypes.func.isRequired,
    }).isRequired,
    documentAssetNodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
    documentAssetSort: PropTypes.string.isRequired,
    initiallySelected: PropTypes.instanceOf(Message),
    isDocumentAssetSearchFulfilled: PropTypes.bool,
    isOpen: PropTypes.bool,
    label: PropTypes.string,
    multiAssetErrorMessage: PropTypes.string,
    node: PropTypes.instanceOf(Message),
    onCloseUploader: PropTypes.func,
    onSelectDocument: PropTypes.func.isRequired,
    onToggleModal: PropTypes.func.isRequired,
    request: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    documentAssetNodes: [],
    initiallySelected: null,
    isDocumentAssetSearchFulfilled: false,
    isOpen: false,
    label: 'Select Document',
    multiAssetErrorMessage: 'Invalid Action: Trying to upload more than one document.',
    node: null,
    onCloseUploader: noop,
    request: null,
  };

  constructor(props) {
    super(props);
    const { initiallySelected } = props;
    this.state = {
      documentQ: '',
      isUploaderOpen: false,
      selectedDocumentNode: initiallySelected || null,
    };
    this.handleChangeQ = this.handleChangeQ.bind(this);
    this.handleChangeSearchParam = this.handleChangeSearchParam.bind(this);
    this.handleToggleUploader = this.handleToggleUploader.bind(this);
    this.handleSelectDocument = this.handleSelectDocument.bind(this);
  }

  componentDidMount() {
    this.handleSearchDocumentAssets();
    this.searchInput.focus();
  }

  componentWillUnmount() {
    const { delegate } = this.props;
    delegate.handleClearDocumentAssetChannel();
  }

  handleChangeQ({ target: { value: documentQ } }) {
    this.setState({ documentQ }, this.handleSearchDocumentAssets);
  }

  handleChangeSearchParam(key, value) {
    const { delegate, request } = this.props;

    const newRequest = { ...request.toObject(), [key]: value };

    delete newRequest.request_id;
    delegate.handleSearchDocumentAssets(newRequest);
  }

  handleSearchDocumentAssets() {
    const { documentQ } = this.state;
    const { delegate, documentAssetSort } = this.props;
    delegate.handleSearchDocumentAssets({ q: documentQ, sort: documentAssetSort });
  }

  handleSelectDocument(selectedDocumentNode) {
    this.setState({ selectedDocumentNode });
  }

  handleToggleUploader(asset) {
    this.setState(({ isUploaderOpen }) => ({
      isUploaderOpen: !isUploaderOpen,
    }), () => {
      const { documentQ, isUploaderOpen } = this.state;
      if (!isUploaderOpen) {
        const { delegate, documentAssetSort, onCloseUploader } = this.props;
        if (asset) {
          this.handleSelectDocument(asset);
          delegate.handleSearchDocumentAssets({ q: documentQ, sort: documentAssetSort });
        }
        onCloseUploader(asset);
        this.searchInput.focus();
      }
    });
  }

  render() {
    const {
      initiallySelected,
      delegate,
      isOpen,
      request,
      label,
      multiAssetErrorMessage,
      node,
      onSelectDocument,
      onToggleModal,
      documentAssetNodes,
      isDocumentAssetSearchFulfilled,
    } = this.props;
    const { isUploaderOpen, documentQ, selectedDocumentNode } = this.state;

    return (
      <div>
        <Modal centered size="xxl" isOpen={isOpen} toggle={onToggleModal}>
          <ModalHeader toggle={onToggleModal}>
            <span className="nowrap">{label}</span>
          </ModalHeader>
          <ModalBody className="p-0">
            <div className="sticky-top px-4 py-2 shadow-depth-2 bg-white" style={{ marginBottom: '1px' }}>
              <InputGroup size="sm">
                <Input
                  autoFocus
                  className="form-control"
                  onChange={this.handleChangeQ}
                  placeholder="Search documents..."
                  type="search"
                  innerRef={(el) => { this.searchInput = el; }}
                  value={documentQ}
                />
                <InputGroupAddon addonType="append">
                  <Button color="secondary" onClick={() => delegate.handleSearchDocumentAssets({ ...request.toObject() })}>
                    <Icon imgSrc="search" className="mr-0" />
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </div>
            <ScrollableContainer
              className="bg-gray-400"
              style={{ height: 'calc(100vh - 275px)' }}
            >
              {!isDocumentAssetSearchFulfilled
                ? <Spinner className="p-4" />
                : (
                  <DocumentAssetsTable
                    nodes={documentAssetNodes}
                    selectedNode={selectedDocumentNode || initiallySelected}
                    onSelectNode={this.handleSelectDocument}
                  />
                )}
            </ScrollableContainer>
          </ModalBody>
          <ModalFooter>
            <Button
              className="mr-auto"
              color="primary"
              onClick={this.handleToggleUploader}
            >
              Upload
            </Button>
            <Button
              onClick={onToggleModal}
              innerRef={(el) => { this.cancelBtn = el; }}
            >
              Cancel
            </Button>
            <Button
              disabled={!selectedDocumentNode}
              onClick={() => onSelectDocument(selectedDocumentNode)}
            >
              Add
            </Button>
          </ModalFooter>
        </Modal>
        {isUploaderOpen && (
        <Uploader
          allowedMimeTypes={['text/plain', 'text/vtt', 'text/srt']}
          allowMultiUpload={false}
          isOpen={isUploaderOpen}
          multiAssetErrorMessage={multiAssetErrorMessage}
          onToggleUploader={this.handleToggleUploader}
        />
        )}
      </div>
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(DocumentAssetPickerModal);
