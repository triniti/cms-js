import { actionTypes } from '../constants';

export default (formName) => ({
  type: actionTypes.EDITOR_DIRTIED,
  formName,
});
