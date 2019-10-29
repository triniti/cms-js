import {
  getFormInitialValues,
  getFormValues,
  isDirty,
  isPristine,
  isValid,
} from 'redux-form';
import getAlerts from '@triniti/admin-ui-plugin/selectors/getAlerts';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';
import areDatesEqual from '@triniti/cms/utils/areDatesEqual';

import { formNames } from '../../constants';

/**
 * @param {Object} state     - The entire redux state.
 * @returns {Object}
 */
export default (state) => {
  const formName = `${formNames.BATCH_EDIT}`;
  const { isBatchEditOpen } = state.dam.batchEdit;
  const isFormDirty = isDirty(formName)(state);
  const isFormPristine = isPristine(formName)(state);
  const isFormValid = isValid(formName)(state);
  const initialValues = getFormInitialValues(formName)(state);
  const currentValues = getFormValues(formName)(state);

  const alerts = getAlerts(state, formName);
  const enableExpirationDateApplyAll = (() => {
    if (!isFormDirty) {
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
    alerts,
    currentValues,
    enableExpirationDateApplyAll,
    getNode: nodeRef => getNode(state, nodeRef),
    isBatchEditOpen,
    isFormDirty,
    isFormPristine,
    isFormValid,
  };
};
