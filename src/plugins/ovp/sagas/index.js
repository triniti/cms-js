import { all, fork, takeLatest } from 'redux-saga/effects';
import { actionTypes } from '../constants';
import startMediaLiveChannelFlow from './startMediaLiveChannelFlow';
import stopMediaLiveChannelFlow from './stopMediaLiveChannelFlow';

function* watchStartMediaLiveChannelFlow() {
  yield takeLatest(actionTypes.START_MEDIALIVE_CHANNEL_REQUESTED, startMediaLiveChannelFlow);
}

function* watchStopMediaLiveChannelFlow() {
  yield takeLatest(actionTypes.STOP_MEDIALIVE_CHANNEL_REQUESTED, stopMediaLiveChannelFlow);
}

export default function* rootSaga() {
  yield all([
    fork(watchStartMediaLiveChannelFlow),
    fork(watchStopMediaLiveChannelFlow),
  ]);
}
