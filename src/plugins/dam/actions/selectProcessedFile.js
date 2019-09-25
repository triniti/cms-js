import { actionTypes } from '../constants';

export default (hashName) => ({
  type: actionTypes.PROCESSED_FILE_SELECTED,
  hashName,
});
