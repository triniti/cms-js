import {
  getFormAsyncErrors,
  getFormError,
  getFormInitialValues,
  getFormMeta,
  getFormSubmitErrors,
  getFormSyncErrors,
  getFormSyncWarnings,
  getFormValues,
  hasSubmitFailed,
  hasSubmitSucceeded,
  isDirty,
  isInvalid,
  isPristine,
  isSubmitting,
  isValid,
} from 'redux-form';

/**
 * Returns a complete representation of a redux form by
 * aggregating results of all other selectors into one object.
 *
 * @param {Object} state    - The entire redux state.
 * @param {string} formName - The name of the redux form.
 *
 * @returns {Object}
 */
export default (state, formName) => ({
  asyncErrors: getFormAsyncErrors(formName)(state),
  dirty: isDirty(formName)(state),
  fields: getFormMeta(formName)(state),
  formError: getFormError(formName)(state),
  initialValues: getFormInitialValues(formName)(state),
  invalid: isInvalid(formName)(state),
  pristine: isPristine(formName)(state),
  submitErrors: getFormSubmitErrors(formName)(state),
  submitFailed: hasSubmitFailed(formName)(state),
  submitSucceeded: hasSubmitSucceeded(formName)(state),
  submitting: isSubmitting(formName)(state),
  syncErrors: getFormSyncErrors(formName)(state),
  syncWarnings: getFormSyncWarnings(formName)(state),
  valid: isValid(formName)(state),
  values: getFormValues(formName)(state),
});
