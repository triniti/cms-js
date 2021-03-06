import { call, fork, put, putResolve } from 'redux-saga/effects';
import get from 'lodash/get';
import sendAlert from '@triniti/admin-ui-plugin/actions/sendAlert';
import toast from '@triniti/admin-ui-plugin/utils/toast';

/**
 * @param {Object} config
 */
export function* successFlow(config) {
  yield call([toast, 'close']);
  const message = get(config, 'action.successMsg', 'Success! File have been updated.');
  yield put(sendAlert({
    type: 'success',
    isDismissible: true,
    delay: 5000,
    message,
  }));
}

/**
 * command failure handler
 * @param {Object} error
 */
export function* failureFlow(error) {
  const message = typeof error.getMessage === 'function' ? error.getMessage() : error.message;

  yield call([toast, 'close']);
  yield put(sendAlert({
    type: 'danger',
    isDismissible: true,
    message: `Patch Assets Failed: ${message}`,
  }));
}

/**
 * Patch Assets Flow
 * @param {Object} action
 */
export default function* (action) {
  const pbj = action.pbj;
  const config = action.config;

  try {
    yield fork([toast, 'show']);
    yield putResolve(pbj);
    yield call(successFlow, config);
  } catch (e) {
    yield call(failureFlow, e);
  }
}
