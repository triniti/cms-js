import { actionChannel, call, delay, fork, put, putResolve, race } from 'redux-saga/effects';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import noop from 'lodash/noop';
import OperationTimedOut from '@triniti/cms/plugins/pbjx/exceptions/OperationTimedOut';
import sendAlert from '@triniti/admin-ui-plugin/actions/sendAlert';
import toast from '@triniti/admin-ui-plugin/utils/toast';
import waitForMyEvent from './waitForMyEvent';
import waitForFlow from './waitForFlow';

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
  expectedEvent,
  failureMessage,
  getNodeRequestSchema,
  onContinueFlow,
  onAfterFailureFlow,
  onAfterSuccessFlow,
  pbj,
  successMessage,
  toastMessage,
  verify,
}) {
  if (toastMessage) {
    yield fork([toast, 'show'], toastMessage);
  } else {
    yield fork([toast, 'show']);
  }

  try {
    const eventChannel = yield actionChannel(expectedEvent);
    yield putResolve(pbj);

    yield race({
      event: call(waitForMyEvent, eventChannel),
      timeout: delay(1000),
    });

    const nodeRef = pbj.has('node_ref') ? pbj.get('node_ref') : NodeRef.fromNode(pbj.get('node'));
    const wasSuccessful = yield call(
      waitForFlow,
      getNodeRequestSchema,
      nodeRef,
      verify,
    );

    if (wasSuccessful) {
      if (onContinueFlow) {
        yield call(onContinueFlow);
        return;
      }
      yield call(successFlow, successMessage, onAfterSuccessFlow);
    } else {
      yield call(failureFlow, failureMessage, new OperationTimedOut(pbj), onAfterFailureFlow);
    }
  } catch (e) {
    yield call(failureFlow, failureMessage, e, onAfterFailureFlow);
  }
}
