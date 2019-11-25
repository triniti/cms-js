import { actionChannel, call, delay, fork, put, putResolve, race } from 'redux-saga/effects';
import ChannelStarted from '@triniti/schemas/triniti/ovp.medialive/event/ChannelStartedV1';
import OperationTimedOut from '@triniti/cms/plugins/pbjx/exceptions/OperationTimedOut';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import sendAlert from '@triniti/admin-ui-plugin/actions/sendAlert';
import startMediaLiveChannel from '@triniti/cms/plugins/ovp/actions/startMediaLiveChannel';
import toast from '@triniti/admin-ui-plugin/utils/toast';
import VideoV1Mixin from '@triniti/schemas/triniti/ovp/mixin/video/VideoV1Mixin';
import waitForFlow from '@triniti/cms/plugins/ncr/sagas/waitForFlow';
import waitForMyEvent from '@triniti/cms/plugins/ncr/sagas/waitForMyEvent';

export default function* startMediaLiveChannelFlow({ pbj }) {
  try {
    yield fork([toast, 'show']);
    const eventChannel = yield actionChannel(ChannelStarted.schema().getCurie().toString());
    yield putResolve(pbj);

    yield race({
      event: call(waitForMyEvent, eventChannel),
      timeout: delay(1000),
    });

    const nodeRef = pbj.get('node_ref');
    const wasSuccessful = yield call(
      waitForFlow,
      resolveSchema(VideoV1Mixin, 'request', 'get-video-request'),
      nodeRef,
      (response) => {
        const isValid = response.pbj.isInSet('metas', 'medialive_channel_status'); // && response.pbj.get('metas').medialive_channel_status === 'RUNNING';
        // todo: make it good like once the server is itself good like
        return isValid;
      },
    );

    yield call([toast, 'hide']);

    if (wasSuccessful) {
      yield put(startMediaLiveChannel(nodeRef));
      yield put(sendAlert({
        type: 'success',
        isDismissible: true,
        delay: 3000,
        message: 'Success! The MediaLive Channel was started.',
      }));
    } else {
      yield put(sendAlert({
        type: 'danger',
        isDismissible: true,
        message: `Start MediaLive Channel Failed: ${(new OperationTimedOut(pbj)).getMessage()}`,
      }));
    }
  } catch (e) {
    yield call([toast, 'hide']);
    yield put(sendAlert({
      type: 'danger',
      isDismissible: true,
      message: `Start MediaLive Channel Failed: ${e.message}.`,
    }));
  }
}
