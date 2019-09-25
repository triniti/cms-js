import { getFormValues } from 'redux-form';

export default (state, { formName }) => ({
  formValues: getFormValues(formName)(state),
});
