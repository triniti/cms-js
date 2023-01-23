// import { initialize, registerField, SubmissionError, touch } from 'redux-form';
import { SUFFIX_INIT_FORM, SUFFIX_SUBMIT_FORM } from 'constants';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
// import updateCounter from '@triniti/cms/plugins/utils/actions/updateCounter';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import clearAlerts from 'actions/clearAlerts';
import sendAlert from 'actions/sendAlert';
import getFriendlyErrorMessage from 'plugins/pbjx/utils/getFriendlyErrorMessage';
import progressIndicator from 'utils/progressIndicator';
import toast from 'utils/toast';
import createNode from 'plugins/ncr/actions/createNode';
import updateNode from 'plugins/ncr/actions/updateNode';

import clearProcessedFiles from 'plugins/dam/actions/clearProcessedFiles';
import patchAssets from 'plugins/dam/actions/patchAssets';
import flushProcessedFilesChannels from 'plugins/dam/actions/flushProcessedFilesChannels';
// import processFiles from 'plugins/dam/actions/processFiles';
import removeProcessedFile from 'plugins/dam/actions/removeProcessedFile';
import requestUpdateAssetsInUploader from 'plugins/dam/actions/requestUpdateAssetsInUploader';
import retryProcessFile from 'plugins/dam/actions/retryProcessFile';
import selectProcessedFile from 'plugins/dam/actions/selectProcessedFile';

// import schemas from './schemas';
import { fileUploadStatuses, utilityTypes } from 'plugins/dam/constants';

const okayToLeave = async () => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'You have unsaved changes!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, leave!',
    reverseButtons: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
  });

  return result.value;
};

export default (props) => {
  const dispatch = useDispatch();

  const {
    delegate,
    acceptedFiles,
    allowedMimeTypes,
    editMode,
    files,
    form,
    formState,
    galleryRef,
    linkedRefs,
    mimeTypeErrorMessage,
    multiAssetErrorMessage,
    nodeRef,
    node,
    refreshNode,
    sequence,
  } = props;


  const handleCreditApplyAll = () => {};
  const handleDeleteFile = () => {};
  const handleExpiresAtApplyAll = () => {};
  
  const handleFileDrop = (droppedFiles) => {
    dispatch(processFiles(droppedFiles, linkedRefs, galleryRef, sequence));
  };

  const handleFileDropRejected = (errors) => {
    dispatch(sendAlert({
      type: 'danger',
      isDismissible: true,
      message: mimeTypeErrorMessage,
    }));
  }

  const handleRetry = () => {};
  const handleSelectFile = () => {};
  const handleSubmit = () => {};

  return {
    handleCreditApplyAll,
    handleDeleteFile,
    handleExpiresAtApplyAll,
    handleFileDrop,
    handleFileDropRejected,
    handleRetry,
    handleSelectFile,
    handleSubmit,
  };
}

// class Delegate extends AbstractDelegate {
class Delegate {
  // constructor(dependencies) {
  //   super({
  //     schemas,
  //   }, dependencies);
  // }

  componentDidMount() {
    const { galleryRef, lastGallerySequence } = this.component.props;
    if (galleryRef) {
      this.dispatch(
        updateCounter(utilityTypes.GALLERY_SEQUENCE_COUNTER, lastGallerySequence),
      );
    }
  }

  createFormEvent(data, formProps) {
    const command = this.getSchemas().updateNode.createMessage({
      node_ref: NodeRef.fromNode(formProps.node),
      // old_node: formProps.node.freeze(),
      new_node: formProps.node.clone(),
    });
    return new FormEvent(command, formProps.form, data, formProps);
  }

  /**
   * @inheritDoc
   * @return {*}
   */
  getInitialValues() {
    const node = this.getNode();
    const formEvent = this.createFormEvent({}, { node, form: this.getFormName() });
    this.pbjx.trigger(formEvent.getMessage(), SUFFIX_INIT_FORM, formEvent);

    return formEvent.getData();
  }

  /**
   * @inheritDoc
   * @return {*}
   */
  getNode() {
    return this.component.props.activeAsset || this.component.props.node;
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    const { galleryRef, onClose, processedFilesAssets } = this.component.props;
    onClose(processedFilesAssets);
    this.dispatch(clearProcessedFiles());
    if (galleryRef) {
      this.dispatch(updateCounter(utilityTypes.GALLERY_SEQUENCE_COUNTER, null));
    }
  }

  // Needed methods
  handleSubmit(data, formDispatch, formProps) {
    return new Promise((resolve, reject) => {
      const formEvent = this.createFormEvent(data, formProps);
      const command = formEvent.getMessage();

      try {
        this.pbjx.trigger(command, SUFFIX_SUBMIT_FORM, formEvent);
        const errors = { ...formProps.asyncErrors, ...formProps.syncErrors };
        Object.entries(errors).forEach(([key, value]) => {
          formEvent.addError(key, value);
        });
        if (formEvent.hasErrors()) {
          Object.keys(formEvent.getErrors()).forEach((key) => {
            if (!formProps.registeredFields[key]) {
              this.dispatch(registerField(formProps.form, key, 'Field'));
              this.dispatch(touch(formProps.form, key));
            }
          });
          reject(new SubmissionError(formEvent.getErrors()));
          return;
        }
      } catch (e) {
        reject(new SubmissionError({ _error: e.stack.toString() }));
        return;
      }

      this.dispatch(requestUpdateAssetsInUploader(command, resolve, reject, {
        schemas, formName: formProps.form, activeHashName: this.component.props.activeHashName,
      }));
    });
  }

  handleFileDrop(droppedFiles) {
    const {
      allowedMimeTypes,
      allowMultiUpload,
      files,
      galleryRef,
      linkedRefs,
      mimeTypeErrorMessage,
      multiAssetErrorMessage,
      sequence,
    } = this.component.props;
    if (
      allowedMimeTypes
      && droppedFiles.some(({ type }) => !allowedMimeTypes.some((mimeType) => mimeType === type))
    ) {
      this.dispatch(sendAlert({
        type: 'danger',
        isDismissible: true,
        message: mimeTypeErrorMessage,
      }));
      return;
    }
    if (!allowMultiUpload) {
      const uploadedFiles = Object.keys(files).reduce((accumulator, hashName) => {
        const fileInfo = files[hashName];
        if (fileInfo.status !== fileUploadStatuses.ERROR) {
          accumulator.push(fileInfo);
        }
        return accumulator;
      }, []);
      // validate that there's only one dropped file and no files uploaded yet
      const isValidToUpload = (droppedFiles.length === 1 && !uploadedFiles.length);
      if (!isValidToUpload) {
        this.dispatch(sendAlert({
          type: 'danger',
          isDismissible: true,
          message: multiAssetErrorMessage,
        }));
        return;
      }
    }

    this.dispatch(processFiles(droppedFiles, linkedRefs, galleryRef, sequence, this.config));
  }

  handleDeleteFile() {
    this.dispatch(removeProcessedFile(this.component.props.activeHashName));
  }

  handleRetry(error) {
    this.dispatch(retryProcessFile(this.component.props.activeHashName, error));
  }

  handleSelectFile(hashName) {
    this.dispatch(selectProcessedFile(hashName));
  }

  handleCreditApplyAll(credit, files, initialValues) {
    const config = { schemas, assetCount: Object.keys(files).length };
    const data = {
      fields: ['credit'],
      values: { credit },
    };
    this.dispatch(initialize(
      this.getFormName(),
      { ...initialValues, credit: { value: credit } },
      'credit',
    ));
    this.dispatch(patchAssets(data, files, config));
  }

  handleExpiresAtApplyAll(expiresAt, files, initialValues) {
    const config = { schemas, assetCount: Object.keys(files).length };
    const data = {
      fields: ['expires_at'],
      values: { expires_at: expiresAt },
    };
    this.dispatch(initialize(
      this.getFormName(),
      { ...initialValues, expiresAt },
    ));
    this.dispatch(patchAssets(data, files, config));
  }

  flushProcessedFilesChannels() {
    this.dispatch(flushProcessedFilesChannels());
  }
}

// export { Delegate }; // to allow for site level customization
// export default (dispatch, ownProps, dependencies) => new Delegate(dependencies);
