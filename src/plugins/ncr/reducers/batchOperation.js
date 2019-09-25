import createReducer from '@triniti/app/createReducer';
import { actionTypes, batchOperationStatuses } from '../constants';

export const initialState = {};

const {
  BATCH_OPERATION_DESTROYED,
  BATCH_OPERATION_ENDED,
  BATCH_OPERATION_PAUSED,
  BATCH_OPERATION_RESUMED,
  BATCH_OPERATION_STARTED,
  BATCH_OPERATION_UPDATED,
} = actionTypes;

const onBatchOperationStarted = (prevState = {}, { operation, messages = [] }) => ({
  ...prevState,
  progress: 0,
  status: batchOperationStatuses.STARTED,
  operation,
  messages,
});

const onBatchOperationUpdated = (prevState = {}, { operation, progress, messages }) => ({
  ...prevState,
  progress,
  status: batchOperationStatuses.PENDING,
  operation,
  messages,
});


const onBatchOperationEnded = (prevState = {}) => ({
  ...prevState,
  progress: prevState.progress,
  status: batchOperationStatuses.ENDED,
  operation: prevState.operation,
  messages: prevState.messages,
});

const onBatchOperationResumed = (prevState = {}) => ({
  ...prevState,
  progress: prevState.progress,
  status: batchOperationStatuses.RESUMED,
  operation: prevState.operation,
  messages: prevState.messages,
});

const onBatchOperationPaused = (prevState = {}) => ({
  ...prevState,
  progress: prevState.progress,
  status: batchOperationStatuses.PAUSED,
  operation: prevState.operation,
  messages: prevState.messages,
});

const onBatchOperationDestroyed = () => null;

export default createReducer(initialState, {
  [BATCH_OPERATION_DESTROYED]: onBatchOperationDestroyed,
  [BATCH_OPERATION_ENDED]: onBatchOperationEnded,
  [BATCH_OPERATION_PAUSED]: onBatchOperationPaused,
  [BATCH_OPERATION_RESUMED]: onBatchOperationResumed,
  [BATCH_OPERATION_STARTED]: onBatchOperationStarted,
  [BATCH_OPERATION_UPDATED]: onBatchOperationUpdated,
});
