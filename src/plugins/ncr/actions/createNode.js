import { actionTypes } from '../constants';

export default (command, resolve, reject, history, config) => ({
  type: actionTypes.CREATE_NODE_REQUESTED,
  pbj: command,
  resolve,
  reject,
  history,
  config,
});
