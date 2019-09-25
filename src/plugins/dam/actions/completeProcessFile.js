import { actionTypes } from '../constants';

export default (hashName) => ({
  type: actionTypes.PROCESS_FILE_COMPLETED,
  hashName,
});
