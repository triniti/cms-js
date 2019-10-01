import { actionTypes } from '../constants';

export default (command, config) => ({
  type: actionTypes.RENAME_NODE_REQUESTED,
  pbj: command,
  config,
});
