import { getFormValues, getFormAsyncErrors, getFormSyncErrors } from 'redux-form';

/**
 * @param state
 * @param ownProps
 * @param configs
 * @returns {*}
 */
export default (state, ownProps, { formName }) => {
  const formValues = getFormValues(formName)(state);
  if (!formValues) {
    return { isCreateDisabled: true };
  }

  const formAsyncErrors = getFormAsyncErrors(formName)(state);
  const formSyncErrors = getFormSyncErrors(formName)(state);
  const errors = { ...formAsyncErrors, ...formSyncErrors };

  return {
    formValues,
    isCreateDisabled: !!Object.keys(errors).length,
  };
};
