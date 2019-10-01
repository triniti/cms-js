import { actionTypes } from '../constants';

export default (operation) => ({
  type: actionTypes.BATCH_OPERATION_STARTED,
  operation,
});
