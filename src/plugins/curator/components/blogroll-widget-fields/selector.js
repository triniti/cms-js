import { getFormValues } from 'redux-form';

/**
 * @param {Object}   state        - The entire redux state.
 * @param {{ formName }} ownProps - Props given to the component.
 *
 * @returns {Object}
 */
export default (state, { formName }) => ({
  formValues: getFormValues(formName)(state),
});
