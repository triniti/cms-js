import { actionTypes } from '../constants';

export default (exception) => ({
  type: actionTypes.CONNECTION_REJECTED,
  exception,
});
