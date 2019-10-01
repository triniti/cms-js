import { actionTypes } from '../constants';

export default (command, resolve, reject, reorderGalleryOperation, config) => ({
  type: actionTypes.REORDER_GALLERY_ASSETS_REQUESTED,
  pbj: command,
  resolve,
  reject,
  reorderGalleryOperation,
  config,
});
