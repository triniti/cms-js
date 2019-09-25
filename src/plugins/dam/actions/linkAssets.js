import { actionTypes } from '../constants';

export default (command, resolve, reject, config) => ({
  type: actionTypes.LINK_ASSETS_REQUESTED,
  pbj: command,
  resolve,
  reject,
  config,
});
