import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import React from 'react';
import swal from 'sweetalert2';
import { connect } from 'react-redux';

import createDelegateFactory from '@triniti/app/createDelegateFactory';
import Message from '@gdbots/pbj/Message';
import {
  Button,
  Card,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@triniti/admin-ui-plugin/components';

import delegateFactory, { Delegate } from './delegate';
import DropArea from './DropArea';
import FileList from './FileList';
import Form from './Form';
import Paginator from './Paginator';
import selector from './selector';

import './styles.scss';

class Uploader extends React.Component {
  static async confirmDone(text) {
    return swal.fire({
      cancelButtonClass: 'btn btn-secondary',
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      text,
      title: 'Are you sure?',
      type: 'warning',
      reverseButtons: true,
    });
  }

  static propTypes = {
    activeAsset: PropTypes.instanceOf(Message),
    activeHashName: PropTypes.string,
    allowedMimeTypes: PropTypes.arrayOf(PropTypes.string),
    allowMultiUpload: PropTypes.bool,
    currentValues: PropTypes.shape({}),
    delegate: PropTypes.instanceOf(Delegate).isRequired,
    enableCreditApplyAll: PropTypes.bool,
    enableExpirationDateApplyAll: PropTypes.bool,
    enableSaveChanges: PropTypes.bool,
    files: PropTypes.shape({ hashName: PropTypes.shape({}) }).isRequired,
    hasFilesProcessing: PropTypes.bool,
    hasMultipleFiles: PropTypes.bool,
    isFormDirty: PropTypes.bool,
    isOpen: PropTypes.bool,
    lastGallerySequence: PropTypes.number,
    mimeTypeErrorMessage: PropTypes.string,
    multiAssetErrorMessage: PropTypes.string,
    /* eslint react/no-unused-prop-types: off */
    onClose: PropTypes.func, // This is used in the delegate
    onToggleUploader: PropTypes.func.isRequired,
    uploadedFiles: PropTypes.shape({ hashName: PropTypes.shape({}) }),
  };

  static defaultProps = {
    activeAsset: null,
    activeHashName: null,
    allowedMimeTypes: null,
    allowMultiUpload: true,
    currentValues: {},
    enableCreditApplyAll: false,
    enableExpirationDateApplyAll: false,
    enableSaveChanges: false,
    hasFilesProcessing: false,
    hasMultipleFiles: false,
    isFormDirty: false,
    isOpen: false,
    lastGallerySequence: 0,
    mimeTypeErrorMessage: 'Invalid Action: Trying to upload invalid file type.',
    multiAssetErrorMessage: 'Invalid Action: Trying to upload multiple assets.',
    onClose: noop,
    uploadedFiles: {},
  };

  constructor(props) {
    super(props);
    const {
      delegate,
    } = props;
    delegate.bindToComponent(this);

    this.handleToggleUploader = this.handleToggleUploader.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState){
    const { currentValues, hasFilesProcessing, activeHashName } = this.props;

    const isPropsEqual = (JSON.stringify(currentValues) === JSON.stringify(nextProps.currentValues));

    // debugger;


    if(!isPropsEqual){
      return false;
    }

    const hasUpdatedImage = activeHashName !== nextProps.activeHashName;

    if (hasUpdatedImage || hasFilesProcessing) {
      return true
    } else {
      return false
    }
  }

  componentDidMount() {
    const { delegate } = this.props;
    delegate.componentDidMount();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    nextProps.delegate.bindToComponent(this);
  }

  componentWillUnmount() {
    const { delegate } = this.props;
    delegate.componentWillUnmount();
  }

  handleToggleUploader(toggleAllModals = false) {
    const {
      activeAsset,
      activeHashName,
      delegate,
      hasFilesProcessing,
      isFormDirty,
      onToggleUploader,
    } = this.props;

    // If no files exist
    if (!activeHashName) {
      onToggleUploader();
      return;
    }

    if (hasFilesProcessing || isFormDirty) {
      const confirmText = hasFilesProcessing
        ? 'Some files are still processing. Exiting early will cause an interruption and files may not be saved.'
        : 'Do you want to leave the form without saving?';
      Uploader.confirmDone(confirmText).then(({ value }) => {
        if (value) {
          if (hasFilesProcessing) {
            delegate.flushProcessedFilesChannels();
          }
          onToggleUploader(activeAsset || null, toggleAllModals);
        } else {
          // do nothing, user declined
        }
      });
    } else {
      onToggleUploader(activeAsset || null, toggleAllModals);
    }
  }

  render() {
    const {
      activeAsset,
      activeHashName,
      delegate,
      currentValues,
      enableCreditApplyAll,
      enableExpirationDateApplyAll,
      enableSaveChanges,
      hasFilesProcessing,
      hasMultipleFiles,
      isFormDirty,
      isOpen,
      files,
      uploadedFiles,
    } = this.props;

    return (
      <div>
        <Modal isOpen={isOpen} toggle={() => this.handleToggleUploader(false)} size="lg">
          <ModalHeader toggle={() => this.handleToggleUploader(false)}>
            Upload Assets
          </ModalHeader>
          <ModalBody className="p-0">
            <div className="dam-uploader-wrapper">
              <div className="dam-content">
                <div className="dam-left-col">
                  <div className="dam-drop-zone">
                    <DropArea
                      onDrop={delegate.handleFileDrop}
                    />
                  </div>
                  <div className="dam-file-queue">
                    <FileList
                      activeHashName={activeHashName}
                      files={files}
                      isFormDirty={isFormDirty}
                      onDelete={delegate.handleDeleteFile}
                      onRetry={delegate.handleRetry}
                      onSelectFile={delegate.handleSelectFile}
                    />
                  </div>
                </div>

                <div className="meta-form border-left">
                  <Card className="pt-3 px-3 pb-1 mb-0">
                    {activeHashName && activeAsset && !hasFilesProcessing
                      // Form `key` is REQUIRED to update the form
                      // when activeHashName has changed
                      && (
                        <Form
                          key={delegate.getFormName()}
                          form={delegate.getFormName()}
                          activeHashName={activeHashName}
                          currentValues={currentValues}
                          enableCreditApplyAll={enableCreditApplyAll}
                          enableExpirationDateApplyAll={enableExpirationDateApplyAll}
                          files={files}
                          onCreditApplyToAll={delegate.handleCreditApplyAll}
                          onExpiresAtApplyToAll={delegate.handleExpiresAtApplyAll}
                          hasMultipleFiles={hasMultipleFiles}
                          initialValues={delegate.getInitialValues()}
                          node={activeAsset}
                          validate={delegate.handleValidate}
                          warn={delegate.handleWarn}
                          onSave={delegate.handleSave}
                          onSubmit={delegate.handleSubmit}
                          uploadedFiles={uploadedFiles}
                        />
                      )}
                    {activeHashName && !activeAsset && <h3>Processing...</h3>}
                    {!activeHashName && 'Add files using the component to the left.'}
                  </Card>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="p-0">
            <div className="align-self-start dam-pagination-col">
              <Paginator
                files={files}
                onSelectFile={delegate.handleSelectFile}
                className="m-auto"
              />
            </div>
            {activeHashName && activeAsset
              && (
                <div className="ml-auto pr-3">
                  <div>
                    <Button
                      onClick={delegate.handleSave}
                      disabled={!enableSaveChanges}
                    >
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => this.handleToggleUploader(true)}
                      disabled={hasFilesProcessing}
                    >
                      Done
                    </Button>
                  </div>
                </div>
              )}
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default connect(
  selector,
  createDelegateFactory(delegateFactory),
)(React.memo(Uploader));
