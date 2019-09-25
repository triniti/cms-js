import { actionTypes } from '../constants';

export default (hashName) => ({
  type: actionTypes.UPLOAD_FILE_STARTED,
  hashName,
});
