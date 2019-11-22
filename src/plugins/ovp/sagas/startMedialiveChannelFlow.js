import { actionChannel, call, delay, fork, put, putResolve, race } from 'redux-saga/effects';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import OperationTimedOut from '@triniti/cms/plugins/pbjx/exceptions/OperationTimedOut';
import waitForMyEvent from '@triniti/cms/plugins/ncr/sagas/waitForMyEvent';
import waitForFlow from '@triniti/cms/plugins/ncr/sagas/waitForFlow';
import VideoV1Mixin from '@triniti/schemas/triniti/ovp/mixin/video/VideoV1Mixin';
import sendAlert from '@triniti/admin-ui-plugin/actions/sendAlert';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import ChannelStarted from '@triniti/schemas/triniti/ovp.medialive/event/ChannelStartedV1';
import toast from '@triniti/admin-ui-plugin/utils/toast';
import startMedialiveChannel from '@triniti/cms/plugins/ovp/actions/startMedialiveChannel';

export default function* startMedialiveChannelFlow({ pbj }) {
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
        const wuf = response.pbj.isInSet('metas', 'medialive_channel_status'); // && response.pbj.get('metas').medialive_channel_status === 'RUNNING';

        return wuf;
      },
    );

    yield call([toast, 'hide']);

    if (wasSuccessful) {
      yield put(startMedialiveChannel(nodeRef));
      yield put(sendAlert({
        type: 'success',
        isDismissible: true,
        delay: 3000,
        message: 'Success! The Medialive Channel was started.',
      }));
    } else {
      yield put(sendAlert({
        type: 'danger',
        isDismissible: true,
        message: `Start Medialive Channel Failed: ${(new OperationTimedOut(pbj)).getMessage()}.`,
      }));
    }
  } catch (e) {
    yield call([toast, 'hide']);
    yield put(sendAlert({
      type: 'danger',
      isDismissible: true,
      message: `Start Medialive Channel Failed: ${e.getMessage()}.`,
    }));
  }
}
