import get from 'lodash/get';
import {
  getFormInitialValues,
  getFormValues,
  isDirty,
  isPristine,
  isValid,
} from 'redux-form';
import getAlerts from '@triniti/admin-ui-plugin/selectors/getAlerts';
import getCounter from '@triniti/cms/plugins/utils/selectors/getCounter';

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
 * @param {Date|null} initialValue
 * @param {Date|null} currentValue
 * @return {boolean}
 */
const areDatesEqual = (initial, current) => {
  if ((initial && !current) || (!initial && current)) {
    return false;
  }
  if (initial === current) {
    return true;
  }
  return initial.toISOString() === current.toISOString();
};

/**
 * @param {Object} state     - The entire redux state.
 * @returns {Object}
 */
export default (state) => {
  const activeHashName = getActiveHashName(state);
  const formName = `${formNames.UPLOADER_FORM_PREFIX}${activeHashName}`;
  const isFormDirty = isDirty(formName)(state);
  const isFormPristine = isPristine(formName)(state);
  const isFormValid = isValid(formName)(state);
  const initialValues = getFormInitialValues(formName)(state);
  const currentValues = getFormValues(formName)(state);

  const files = getFileList(state);
  const hasMultipleFiles = Object.keys(files).length > 1;
  const filesProcessing = getFilesProcessing(files);
  const hasFilesProcessing = filesProcessing.length > 0;
  const enableCreditApplyAll = isFormDirty
    && !hasFilesProcessing
    && get(initialValues, 'credit.value') !== get(currentValues, 'credit.value');
  const alerts = getAlerts(state, formName);
  const sequence = getCounter(state, utilityTypes.GALLERY_SEQUENCE_COUNTER);
  const enableExpirationDateApplyAll = (() => {
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

  return {
    activeHashName,
    alerts,
    currentValues,
    enableCreditApplyAll,
    enableExpirationDateApplyAll,
    files,
    filesProcessing,
    sequence,
    hasFilesProcessing,
    hasMultipleFiles,
    isFormDirty,
    isFormPristine,
    isFormValid,
    activeAsset: getActiveAsset(activeHashName)(state),
    initialValues: getActiveFileInfo(state),
    processedFilesAssets: getProcessedFilesAssets(state),
  };
};
