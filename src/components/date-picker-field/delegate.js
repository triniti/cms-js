import { touch } from 'redux-form';

export default (dispatch, { onTouch }) => ({
  onTouch: onTouch || ((formName, field) => {
    dispatch(touch(formName, field));
  }),
});
