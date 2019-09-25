import { actionTypes } from '../constants';

export default (command, config) => ({
  type: actionTypes.LOCK_NODE_REQUESTED,
  pbj: command,
  config,
});
