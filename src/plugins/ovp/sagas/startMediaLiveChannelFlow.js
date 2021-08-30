import { actionChannel, call, delay, fork, put, putResolve, race } from 'redux-saga/effects';
import ChannelStarted from '@triniti/schemas/triniti/ovp.medialive/event/ChannelStartedV1';
import OperationTimedOut from '@triniti/cms/plugins/pbjx/exceptions/OperationTimedOut';
import sendAlert from '@triniti/admin-ui-plugin/actions/sendAlert';
import toast from '@triniti/admin-ui-plugin/utils/toast';
import waitForMyEvent from '@triniti/cms/plugins/ncr/sagas/waitForMyEvent';

/**
 * @param {Object} error
 */
function* failureFlow(error) {
  const message = typeof error.getMessage === 'function' ? error.getMessage() : error.message;

  yield call([toast, 'hide']);
  yield put(sendAlert({
    type: 'danger',
    isDismissible: true,
    message: `Start MediaLive Channel Failed: ${message}`,
  }));
}

export default function* startMediaLiveChannelFlow({ pbj }) {
  try {
    yield fork([toast, 'show'], 'starting channel');
    const eventChannel = yield actionChannel(ChannelStarted.schema().getCurie().toString());
    yield putResolve(pbj);

    const result = yield race({
      event: call(waitForMyEvent, eventChannel),
      timeout: delay(600 * 1000),
    });

    if (result.timeout) {
      yield call(failureFlow, new OperationTimedOut(pbj));
      return;
    }

    yield call([toast, 'hide']);
    yield put(sendAlert({
      type: 'success',
      isDismissible: true,
      delay: 3000,
      message: 'Success! The MediaLive Channel was started.',
    }));
  } catch (e) {
    yield call(failureFlow, e);
  }
}
