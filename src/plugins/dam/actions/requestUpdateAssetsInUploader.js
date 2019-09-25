import { actionTypes } from '../constants';

export default (pbj, resolve, reject, config) => ({
  type: actionTypes.UPDATE_ASSETS_IN_UPLOADER_REQUESTED,
  pbj,
  resolve,
  reject,
  config,
});
