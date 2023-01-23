import get from 'lodash/get';
// import {
//   getFormInitialValues,
//   getFormValues,
//   isDirty,
// } from 'redux-form';
import getAlerts from 'selectors/getAlerts';
import getCounter from 'selectors/getCounter';
import areDatesEqual from '../../utils/areDatesEqual';

import { fileUploadStatuses, utilityTypes } from '../../constants';
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
  // const isFormDirty = isDirty(formName)(state);
  // const initialValues = getFormInitialValues(formName)(state);
  // const currentValues = getFormValues(formName)(state);
  const isFormDirty = false;
  const initialValues = {};
  const currentValues = {};

  const files = getFileList(state);
  const filesProcessing = getFilesProcessing(files);
  const hasFilesProcessing = filesProcessing.length > 0;
  const hasMultipleFiles = Object.keys(files).length > 1;
  const isActiveFileProcessing = !!filesProcessing.find((file) => file.hashName === activeHashName);
  const isActiveFileValid = activeHashName !== null && !files[activeHashName].error;
  const enableSaveChanges = isActiveFileValid && !isActiveFileProcessing && isFormDirty;
  const enableCreditApplyAll = enableSaveChanges
    && get(initialValues, 'credit.value') !== get(currentValues, 'credit.value');
  const enableExpirationDateApplyAll = enableSaveChanges
    && !areDatesEqual(initialValues.expiresAt, currentValues.expiresAt);
  // const alerts = getAlerts(state, formName);
  const alerts = null;
  const sequence = getCounter(state, utilityTypes.GALLERY_SEQUENCE_COUNTER);
  const uploadedFiles = Object.fromEntries(Object.entries(files)
    .filter(([, file]) => !file.error && file.status === fileUploadStatuses.COMPLETED));

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
    uploadedFiles,
  };
};
