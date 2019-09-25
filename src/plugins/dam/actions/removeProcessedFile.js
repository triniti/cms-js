import { actionTypes } from '../constants';

export default (hashName) => ({
  type: actionTypes.REMOVE_PROCESSED_FILE_REQUESTED,
  hashName,
});
