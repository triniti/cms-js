import { actionTypes } from '../constants';

export default (operation, progress, messages) => ({
  type: actionTypes.BATCH_OPERATION_UPDATED,
  operation,
  progress,
  messages,
});
