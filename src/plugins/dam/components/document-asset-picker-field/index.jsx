import { Button, FormGroup, FormText, Label, Icon, RouterLink } from '@triniti/admin-ui-plugin/components';
import { connect } from 'react-redux';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import DocumentAssetPickerModal from '@triniti/cms/plugins/dam/components/document-asset-picker-modal';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import pbjUrl from '@gdbots/pbjx/pbjUrl';
import PropTypes from 'prop-types';
import React from 'react';
import startCase from 'lodash/startCase';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import selector from './selector';

class DocumentAssetPickerField extends React.Component {
  static propTypes = {
    currentDocument: PropTypes.instanceOf(Message),
    documentRef: PropTypes.instanceOf(NodeRef),
    input: PropTypes.shape({
      onChange: PropTypes.func,
      value: PropTypes.oneOfType([
        PropTypes.instanceOf(NodeRef),
        PropTypes.string,
      ]),
    }).isRequired,
    isEditMode: PropTypes.bool,
    label: PropTypes.string,
    meta: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    multiAssetErrorMessage: PropTypes.string,
    node: PropTypes.instanceOf(Message),
    searchDocumentsQ: PropTypes.string,
  };

  static defaultProps = {
    currentDocument: null,
    documentRef: null,
    isEditMode: true,
    label: '',
    multiAssetErrorMessage: 'Invalid Action: Trying to upload more than one document.',
    node: null,
    searchDocumentsQ: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
    };
    this.handleCloseUploader = this.handleCloseUploader.bind(this);
    this.handleSelectDocument = this.handleSelectDocument.bind(this);
    this.handleSetDocument = this.handleSetDocument.bind(this);
    this.handleToggleModal = this.handleToggleModal.bind(this);
  }

  handleToggleModal() {
    this.setState(({ isModalOpen }) => ({ isModalOpen: !isModalOpen }));
  }

  handleSetDocument(document) {
    const { input } = this.props;
    input.onChange(NodeRef.fromNode(document).toString());
  }

  handleSelectDocument(document) {
    this.handleSetDocument(document);
    this.handleToggleModal();
  }

  handleCloseUploader(document, toggleAllModals) {
    if (document) {
      this.handleSetDocument(document);
    }
    if (toggleAllModals) {
      this.handleToggleModal();
    }
  }

  render() {
    const { isModalOpen } = this.state;
    const {
      currentDocument,
      documentRef,
      input: { onChange, value },
      isEditMode,
      label,
      meta: { error },
      multiAssetErrorMessage,
      node,
      searchDocumentsQ,
    } = this.props;

    return (
      <div className="mb-4">
        <FormGroup className="mb-0">
          <Label>{label}</Label>
          {currentDocument && (
          <>
            <RouterLink to={pbjUrl(currentDocument, 'cms')}>
              <Button id={`view-${currentDocument.get('_id')}`} size="xs" color="hover" radius="circle" className="mb-1 ml-2">
                <Icon imgSrc="eye" alt="view" />
              </Button>
              <UncontrolledTooltip placement="auto" target={`view-${currentDocument.get('_id')}`}>View</UncontrolledTooltip>
            </RouterLink>
            <RouterLink to={`${pbjUrl(currentDocument, 'cms')}/edit`}>
              <Button id={`edit-${currentDocument.get('_id')}`} size="xs" color="hover" radius="circle" className="mb-1 mx-1">
                <Icon imgSrc="pencil" alt="edit" />
              </Button>
              <UncontrolledTooltip placement="auto" target={`edit-${currentDocument.get('_id')}`}>Edit</UncontrolledTooltip>
            </RouterLink>
            <a
              href={damUrl(NodeRef.fromNode(currentDocument))}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button id={`open-in-new-tab-${currentDocument.get('_id')}`} size="xs" color="hover" radius="circle" className="mb-1">
                <Icon imgSrc="external" alt="open" />
              </Button>
              <UncontrolledTooltip placement="auto" target={`open-in-new-tab-${currentDocument.get('_id')}`}>Open in new tab</UncontrolledTooltip>
            </a>
          </>
          )}
          {value && <p>{currentDocument ? currentDocument.get('title') : value}</p>}
        </FormGroup>
        {isEditMode && (
        <Button
          disabled={!isEditMode}
          onClick={this.handleToggleModal}
        >
          {`Select a${value && ' new'} ${startCase(label)}`}
        </Button>
        )}
        {isEditMode && error && (
        <FormText key="error" color="danger" className="ml-1">{error}</FormText>
        )}
        {value && isEditMode
          && <Button onClick={onChange}>{`Clear ${startCase(label)}`}</Button>}
        {isModalOpen && (
          <DocumentAssetPickerModal
            documentRef={documentRef}
            isOpen={isModalOpen}
            multiAssetErrorMessage={multiAssetErrorMessage}
            node={node}
            onCloseUploader={this.handleCloseUploader}
            onSelectDocument={this.handleSelectDocument}
            onToggleModal={this.handleToggleModal}
            searchDocumentsQ={searchDocumentsQ}
          />
        )}
      </div>
    );
  }
}

export default connect(selector)(DocumentAssetPickerField);
