import { actionTypes } from '../constants';

export default (formName) => ({
  type: actionTypes.EDITOR_DESTROYED,
  formName,
});
