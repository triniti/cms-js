import { initialize, registerField, SubmissionError, touch } from 'redux-form';
import { SUFFIX_INIT_FORM, SUFFIX_SUBMIT_FORM } from '@triniti/app/constants';
import FormEvent from '@triniti/app/events/FormEvent';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import AbstractDelegate from '@triniti/cms/plugins/ncr/screens/node/AbstractDelegate';
import sendAlert from '@triniti/admin-ui-plugin/actions/sendAlert';
import updateCounter from '@triniti/cms/plugins/utils/actions/updateCounter';

import clearProcessedFiles from '../../actions/clearProcessedFiles';
import patchAssets from '../../actions/patchAssets';
import flushProcessedFilesChannels from '../../actions/flushProcessedFilesChannels';
import processFiles from '../../actions/processFiles';
import removeProcessedFile from '../../actions/removeProcessedFile';
import requestUpdateAssetsInUploader from '../../actions/requestUpdateAssetsInUploader';
import retryProcessFile from '../../actions/retryProcessFile';
import selectProcessedFile from '../../actions/selectProcessedFile';

import schemas from './schemas';
import { formNames, fileUploadStatuses, utilityTypes } from '../../constants';

class Delegate extends AbstractDelegate {
  constructor(dependencies) {
    super({
      schemas,
      formNamePrefix: formNames.UPLOADER_FORM_PREFIX,
    }, dependencies);

    this.handleCreditApplyAll = this.handleCreditApplyAll.bind(this);
    this.handleDeleteFile = this.handleDeleteFile.bind(this);
    this.handleExpiresAtApplyAll = this.handleExpiresAtApplyAll.bind(this);
    this.handleFileDrop = this.handleFileDrop.bind(this);
    this.handleRetry = this.handleRetry.bind(this);
    this.handleSelectFile = this.handleSelectFile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

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
    const assetCount = { assetCount: files.length };
    const data = {
      fields: ['credit'],
      values: { credit },
    };
    this.dispatch(initialize(this.getFormName(), { ...initialValues, credit }, 'credit'));
    this.dispatch(patchAssets(data, files, { ...this.config, assetCount }));
  }

  handleExpiresAtApplyAll(expiresAt, files, initialValues) {
    const assetCount = { assetCount: files.length };
    const data = {
      fields: ['expires_at'],
      values: { expires_at: expiresAt },
    };
    this.dispatch(initialize(
      this.getFormName(),
      { ...initialValues, expiresAt },
    ));
    this.dispatch(patchAssets(data, files, { ...this.config, assetCount }));
  }

  getFormName() {
    return `${formNames.UPLOADER_FORM_PREFIX}${this.component.props.activeHashName}`;
  }

  flushProcessedFilesChannels() {
    this.dispatch(flushProcessedFilesChannels());
  }
}

export { Delegate }; // to allow for site level customization
export default (dispatch, ownProps, dependencies) => new Delegate(dependencies);
