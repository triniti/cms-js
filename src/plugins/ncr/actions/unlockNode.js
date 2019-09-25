import { actionTypes } from '../constants';

export default (command, config) => ({
  type: actionTypes.UNLOCK_NODE_REQUESTED,
  pbj: command,
  config,
});
