import { change } from 'redux-form';

export default (dispatch, { formName }) => ({
  handleChange: (field, value) => dispatch(change(formName, field, value)),
});
