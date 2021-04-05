import get from 'lodash/get';
import {
  getFormInitialValues,
  getFormValues,
  isDirty,
} from 'redux-form';
import getAlerts from '@triniti/admin-ui-plugin/selectors/getAlerts';
import getCounter from '@triniti/cms/plugins/utils/selectors/getCounter';
import areDatesEqual from '@triniti/cms/utils/areDatesEqual';

import { formNames, fileUploadStatuses, utilityTypes } from '../../constants';
import getFileList from '../../selectors/getFileList';
import getActiveAsset from '../../selectors/getActiveAsset';
import getActiveFileInfo from '../../selectors/getActiveFileInfo';
import getActiveHashName from '../../selectors/getActiveHashName';
import getProcessedFilesAssets from '../../selectors/getProcessedFilesAssets';

const getFilesProcessing = (files) => Object.keys(files).reduce((accumulator, hashName) => {
  const fileInfo = files[hashName];
  if (
    fileInfo.status !== fileUploadStatuses.COMPLETED
    && fileInfo.status !== fileUploadStatuses.ERROR
  ) {
    accumulator.push({
      hashName,
      fileInfo,
    });
  }
  return accumulator;
}, []);

/**
 * @param {Object} state     - The entire redux state.
 * @returns {Object}
 */
export default (state) => {
  const activeHashName = getActiveHashName(state);
  const formName = `${formNames.UPLOADER_FORM_PREFIX}${activeHashName}`;
  const isFormDirty = isDirty(formName)(state);
  const initialValues = getFormInitialValues(formName)(state);
  const currentValues = getFormValues(formName)(state);

  const files = getFileList(state);
  const activeFile = files[activeHashName];
  const hasMultipleFiles = Object.keys(files).length > 1;
  const filesProcessing = getFilesProcessing(files);
  const hasFilesProcessing = filesProcessing.length > 0;
  const enableCreditApplyAll = (activeFile && !activeFile.error)
    && isFormDirty
    && !hasFilesProcessing
    && get(initialValues, 'credit.value') !== get(currentValues, 'credit.value');
  const alerts = getAlerts(state, formName);
  const sequence = getCounter(state, utilityTypes.GALLERY_SEQUENCE_COUNTER);
  const enableExpirationDateApplyAll = (() => {
    if (activeFile && activeFile.error) {
      return false;
    }

    if (!isFormDirty) {
      return false;
    }

    if (hasFilesProcessing) {
      return false;
    }

    if (!initialValues.expiresAt && currentValues.expiresAt) {
      return true;
    }

    if (initialValues.expiresAt) {
      return !areDatesEqual(initialValues.expiresAt, currentValues.expiresAt);
    }

    return true;
  })();
  const enableSaveChanges = (activeFile && !activeFile.error) && !hasFilesProcessing && isFormDirty;

  return {
    activeAsset: getActiveAsset(activeHashName)(state),
    activeHashName,
    alerts,
    currentValues,
    enableCreditApplyAll,
    enableExpirationDateApplyAll,
    enableSaveChanges,
    files,
    filesProcessing,
    hasFilesProcessing,
    hasMultipleFiles,
    initialValues: getActiveFileInfo(state),
    isFormDirty,
    processedFilesAssets: getProcessedFilesAssets(state),
    sequence,
  };
};
