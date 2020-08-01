import { Button, FormGroup, FormText, Label } from '@triniti/admin-ui-plugin/components';
import DocumentAssetPickerModal from '@triniti/cms/plugins/dam/components/document-asset-picker-modal';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import PropTypes from 'prop-types';
import React from 'react';
import startCase from 'lodash/startCase';

class DocumentAssetPickerField extends React.Component {
  static propTypes = {
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
    node: PropTypes.instanceOf(Message),
    searchDocumentsQ: PropTypes.string,
  };

  static defaultProps = {
    documentRef: null,
    isEditMode: true,
    label: '',
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
      documentRef,
      searchDocumentsQ,
      input: { onChange, value },
      isEditMode,
      label,
      meta: { error },
      node,
    } = this.props;

    return (
      <div className="mb-4">
        <FormGroup className="mb-0">
          <Label>{label}</Label>
          {value && <p>{value}</p>}
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
            isOpen={isModalOpen}
            node={node}
            documentRef={documentRef}
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

export default DocumentAssetPickerField;
