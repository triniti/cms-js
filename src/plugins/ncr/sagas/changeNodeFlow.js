import { call, fork, put, putResolve } from 'redux-saga/effects';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import noop from 'lodash/noop';
import sendAlert from '@triniti/admin-ui-plugin/actions/sendAlert';
import toast from '@triniti/admin-ui-plugin/utils/toast';

/**
 * @param {String}   successMessage
 * @param {Function} onAfterSuccessFlow
 */
export function* successFlow(successMessage, onAfterSuccessFlow = noop) {
  yield call(onAfterSuccessFlow);
  yield call([toast, 'close']);
  yield put(sendAlert({
    type: 'success',
    isDismissible: true,
    delay: 3000,
    message: successMessage,
  }));
}

/**
 * @param {String}   failureMessage
 * @param {Object}   error
 * @param {Function} onAfterFailureFlow
 */
export function* failureFlow(failureMessage, error, onAfterFailureFlow = noop) {
  yield call(onAfterFailureFlow, error);
  const message = typeof error.getMessage === 'function' ? error.getMessage() : error.message;

  yield call([toast, 'close']);
  yield put(sendAlert({
    type: 'danger',
    isDismissible: true,
    message: `${failureMessage}${message}`,
  }));
}

export default function* ({
  failureMessage,
  getNodeRequestSchema,
  onContinueFlow,
  onAfterFailureFlow,
  onAfterSuccessFlow,
  pbj,
  successMessage,
  toastMessage,
}) {
  if (toastMessage) {
    yield fork([toast, 'show'], toastMessage);
  } else {
    yield fork([toast, 'show']);
  }

  try {
    yield putResolve(pbj);

    // fetching the node after the operation is left for
    // legacy reasons, some UI operations expect the node
    // to be fetched again which resets redux state.
    const nodeRef = pbj.has('node_ref') ? pbj.get('node_ref') : NodeRef.fromNode(pbj.get('node'));
    const getNodeRequest = getNodeRequestSchema.createMessage().set('node_ref', nodeRef);
    yield putResolve(getNodeRequest);

    if (onContinueFlow) {
      yield call(onContinueFlow);
      return;
    }

    yield call(successFlow, successMessage, onAfterSuccessFlow);
  } catch (e) {
    yield call(failureFlow, failureMessage, e, onAfterFailureFlow);
  }
}
