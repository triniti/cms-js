import { actionTypes } from '../constants';

export default (hashName, previewUrl) => ({
  type: actionTypes.UPLOAD_FILE_FULFILLED,
  hashName,
  previewUrl,
});
