import { connect } from 'react-redux';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import DocumentAssetsTable from '@triniti/cms/plugins/dam/components/document-assets-table';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import Pagination from '@triniti/cms/components/pagination';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Modal,
  ModalBody,
  ScrollableContainer,
  Spinner,
} from '@triniti/admin-ui-plugin/components';

import changedDate from '../../utils/changedDate';
import changedTime from '../../utils/changedTime';
import CustomizeOptions from './CustomizeOptions';
import delegateFactory from './delegate';
import Footer from './Footer';
import Header from './Header';
import NotFoundMessage from './NotFoundMessage';
import SearchBar from '../search-bar';
import selector from './selector';

const DOCUMENT_TYPES = ['text/plain', 'text/rtf', 'application/pdf'];

class DocumentBlockModal extends React.Component {
  static propTypes = {
    block: PropTypes.instanceOf(Message).isRequired,
    documentAssetNodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
    documentAssetSort: PropTypes.string.isRequired,
    documentNode: PropTypes.instanceOf(Message),
    imageNode: PropTypes.instanceOf(Message),
    isDocumentAssetSearchFulfilled: PropTypes.bool.isRequired,
    isFreshBlock: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool,
    node: PropTypes.instanceOf(Message),
    onAddBlock: PropTypes.func.isRequired,
    onEditBlock: PropTypes.func.isRequired,
    request: PropTypes.instanceOf(Message),
    toggle: PropTypes.func.isRequired,
    delegate: PropTypes.shape({
      handleClearDocumentAssetChannel: PropTypes.func.isRequired,
      handleSearchDocumentAssets: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    documentNode: null,
    imageNode: null,
    isOpen: false,
    node: null,
    request: null,
  };

  constructor(props) {
    super(props);
    const { block, imageNode, documentNode } = props;
    this.state = {
      activeStep: 0,
      aside: block.get('aside'),
      documentQ: '',
      hasUpdatedDate: block.has('updated_date'),
      isAssetPickerModalOpen: false,
      isReadyToDisplay: false,
      isUploaderOpen: false,
      launchText: block.get('launch_text') || '',
      selectedDocumentNode: documentNode || null,
      selectedImageNode: imageNode || null,
      updatedDate: block.get('updated_date', new Date()),
    };
    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeLaunchText = this.handleChangeLaunchText.bind(this);
    this.handleChangeQ = this.handleChangeQ.bind(this);
    this.handleChangeSearchParam = this.handleChangeSearchParam.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleClearImage = this.handleClearImage.bind(this);
    this.handleCloseUploader = this.handleCloseUploader.bind(this);
    this.handleDecrementStep = this.handleDecrementStep.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
    this.handleIncrementStep = this.handleIncrementStep.bind(this);
    this.handleSearchDocumentAssets = this.handleSearchDocumentAssets.bind(this);
    this.handleSelectDocument = this.handleSelectDocument.bind(this);
    this.handleSelectImage = this.handleSelectImage.bind(this);
    this.handleToggleAssetPickerModal = this.handleToggleAssetPickerModal.bind(this);
    this.handleToggleUploader = this.handleToggleUploader.bind(this);
  }

  componentDidMount() {
    this.handleSearchDocumentAssets();
  }

  UNSAFE_componentWillReceiveProps({ isDocumentAssetSearchFulfilled }) {
    const { activeStep, isReadyToDisplay } = this.state;
    if (!isReadyToDisplay && (activeStep === 0 && isDocumentAssetSearchFulfilled)) {
      this.setState({ isReadyToDisplay: true });
    }
  }

  componentWillUnmount() {
    const { delegate } = this.props;

    delegate.handleClearDocumentAssetChannel();
  }

  setBlock() {
    const {
      aside,
      hasUpdatedDate,
      launchText,
      selectedDocumentNode,
      selectedImageNode,
      updatedDate,
    } = this.state;
    const { block } = this.props;
    return block.schema().createMessage()
      .set('node_ref', NodeRef.fromNode(selectedDocumentNode))
      .set('image_ref', selectedImageNode ? NodeRef.fromNode(selectedImageNode) : null)
      .set('launch_text', launchText || null)
      .set('updated_date', hasUpdatedDate ? updatedDate : null)
      .set('aside', aside);
  }

  handleAddBlock() {
    const { onAddBlock, toggle } = this.props;
    onAddBlock(this.setBlock());
    toggle();
  }

  handleChangeCheckbox({ target: { id, checked } }) {
    this.setState({ [id]: checked });
  }

  handleChangeLaunchText({ target: { value: launchText } }) {
    this.setState({ launchText });
  }

  handleChangeQ({ target: { value: documentQ } }) {
    this.setState({ documentQ }, this.handleSearchDocumentAssets);
  }

  handleChangeDate(date) {
    this.setState(changedDate(date));
  }

  handleChangeSearchParam(key, value) {
    const { delegate, request } = this.props;

    const newRequest = { ...request.toObject(), [key]: value };

    delete newRequest.request_id;
    delegate.handleSearchDocumentAssets(newRequest);
  }

  handleChangeTime({ target: { value: time } }) {
    this.setState(changedTime(time));
  }

  handleCloseUploader(document) {
    if (document) {
      this.handleSearchDocumentAssets();
    }
  }

  handleClearImage() {
    this.setState({ selectedImageNode: null }, this.refocusModal);
  }

  handleToggleUploader(document) {
    this.setState(({ isUploaderOpen }) => ({ isUploaderOpen: !isUploaderOpen }), () => {
      const { isUploaderOpen } = this.state;
      if (!isUploaderOpen) {
        this.refocusModal();
        if (document) {
          this.handleSearchDocumentAssets();
          this.handleSelectDocument(document);
        }
      }
    });
  }

  handleEditBlock() {
    const { onEditBlock, toggle } = this.props;
    onEditBlock(this.setBlock());
    toggle();
  }

  handleDecrementStep() {
    this.setState(({ activeStep }) => ({ activeStep: activeStep - 1 }));
  }

  handleIncrementStep() {
    this.setState(({ activeStep }, { isDocumentAssetSearchFulfilled }) => ({
      activeStep: activeStep + 1,
      isReadyToDisplay: activeStep === 1
        || (activeStep === 0 && isDocumentAssetSearchFulfilled),
    }));
  }

  // eslint-disable-next-line react/destructuring-assignment
  handleSearchDocumentAssets(sort = this.props.documentAssetSort) {
    this.setState({ isReadyToDisplay: false }, () => {
      const { documentQ } = this.state;
      const { delegate } = this.props;
      delegate.handleSearchDocumentAssets({ q: documentQ, sort });
    });
  }

  handleSelectDocument(selectedDocumentNode) {
    this.setState({ selectedDocumentNode });
  }

  handleSelectImage(selectedImageNode) {
    this.setState({ selectedImageNode });
  }

  handleToggleAssetPickerModal() {
    this.setState(({ isAssetPickerModalOpen }) => ({
      isAssetPickerModalOpen: !isAssetPickerModalOpen,
    }), () => {
      const { isAssetPickerModalOpen } = this.state;
      if (!isAssetPickerModalOpen) {
        this.refocusModal();
      }
    });
  }

  /**
   * Needs to return the focus to an element else pressing "ESC" to close the modal won't work
   */
  refocusModal() {
    this.button.focus();
  }

  render() {
    const {
      activeStep,
      aside,
      documentQ,
      hasUpdatedDate,
      isAssetPickerModalOpen,
      isReadyToDisplay,
      isUploaderOpen,
      launchText,
      selectedDocumentNode,
      selectedImageNode,
      updatedDate,
    } = this.state;
    const {
      documentAssetNodes,
      documentAssetSort,
      request,
      isFreshBlock,
      isOpen,
      node,
      toggle,
    } = this.props;

    return (
      <Modal
        autoFocus={false}
        centered
        isOpen={isOpen}
        toggle={toggle}
        size="xxl"
        keyboard={!isAssetPickerModalOpen && !isUploaderOpen}
      >
        <Header
          activeStep={activeStep}
          isFreshBlock={isFreshBlock}
          toggle={toggle}
        />
        <ModalBody className="p-0">
          {activeStep === 0
            && (
              <SearchBar
                onChangeQ={this.handleChangeQ}
                onClick={this.handleSearchDocumentAssets}
                placeholder="Search documents..."
                value={documentQ}
              />
            )}
          <ScrollableContainer
            className="bg-gray-400"
            style={{ height: `calc(100vh - ${activeStep === 0 ? 275 : 167}px)` }}
          >
            {
              !isReadyToDisplay && activeStep !== 1
              && <Spinner centered />
            }
            {isReadyToDisplay && activeStep === 0 && !documentAssetNodes.length
              && (
                <NotFoundMessage
                  allowedMimeTypes={DOCUMENT_TYPES}
                  isUploaderOpen={isUploaderOpen}
                  node={node}
                  onCloseUploader={this.handleCloseUploader}
                  onToggleUploader={this.handleToggleUploader}
                />
              )}
            {isReadyToDisplay && activeStep === 0 && !!documentAssetNodes.length
              && (
                <DocumentAssetsTable
                  nodes={documentAssetNodes}
                  sort={documentAssetSort}
                  onSelectNode={this.handleSelectDocument}
                  onSort={(newSort) => this.handleSearchDocumentAssets(newSort)}
                  selectedNode={selectedDocumentNode}
                />
              )}
            {activeStep === 1
              && (
                <CustomizeOptions
                  aside={aside}
                  block={this.setBlock()}
                  hasUpdatedDate={hasUpdatedDate}
                  isAssetPickerModalOpen={isAssetPickerModalOpen}
                  isImageSelected={!!selectedImageNode}
                  launchText={launchText}
                  node={node}
                  onChangeCheckBox={this.handleChangeCheckbox}
                  onChangeDate={this.handleChangeDate}
                  onChangeLaunchText={this.handleChangeLaunchText}
                  onChangeTime={this.handleChangeTime}
                  onClearImage={this.handleClearImage}
                  onSelectImage={this.handleSelectImage}
                  onToggleAssetPickerModal={this.handleToggleAssetPickerModal}
                  updatedDate={updatedDate}
                />
              )}
          </ScrollableContainer>
        </ModalBody>
        {activeStep === 0 && !!documentAssetNodes.length
          && (
            <Pagination
              className="justify-content-center d-flex mt-2"
              currentPage={request.get('page') || 1}
              onChangePage={(nextPage) => this.handleChangeSearchParam('page', nextPage)}
              total={documentAssetNodes.length}
            />
          )}
        <Footer
          allowedMimeTypes={DOCUMENT_TYPES}
          activeStep={activeStep}
          innerRef={(el) => { this.button = el; }}
          isImageSelected={!!selectedImageNode}
          isFreshBlock={isFreshBlock}
          isNextButtonDisabled={(activeStep === 0 && !selectedDocumentNode) || (activeStep === 1)}
          isUploaderOpen={isUploaderOpen}
          node={node}
          onAddBlock={this.handleAddBlock}
          onCloseUploader={this.handleCloseUploader}
          onDecrementStep={this.handleDecrementStep}
          onEditBlock={this.handleEditBlock}
          onIncrementStep={this.handleIncrementStep}
          onToggleUploader={this.handleToggleUploader}
          toggle={toggle}
        />
      </Modal>
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(DocumentBlockModal);
