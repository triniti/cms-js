import { actionTypes } from '../constants';

export default (exception) => ({
  type: actionTypes.LOGIN_REJECTED,
  exception,
});
