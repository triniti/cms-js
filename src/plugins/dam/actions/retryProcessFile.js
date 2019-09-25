import { actionTypes } from '../constants';

export default (hashName, error) => ({
  type: actionTypes.PROCESS_FILE_RETRY_REQUESTED,
  hashName,
  error,
});
