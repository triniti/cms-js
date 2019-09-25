import { change } from 'redux-form';

export default (dispatch) => ({
  handleChange: (formName, fieldName, value) => dispatch(change(formName, fieldName, value)),
});
