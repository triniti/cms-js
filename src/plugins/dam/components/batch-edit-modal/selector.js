import {
  getFormValues,
  isDirty,
  isPristine,
  isValid,
} from 'redux-form';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';

import { formNames } from '../../constants';

/**
 * @param {Object} state     - The entire redux state.
 * @returns {Object}
 */
export default (state) => {
  const formName = `${formNames.BATCH_EDIT}`;
  const isFormDirty = isDirty(formName)(state);
  const isFormPristine = isPristine(formName)(state);
  const isFormValid = isValid(formName)(state);
  const currentValues = getFormValues(formName)(state);

  return {
    currentValues,
    getNode: (nodeRef) => getNode(state, nodeRef),
    isFormDirty,
    isFormPristine,
    isFormValid,
  };
};
