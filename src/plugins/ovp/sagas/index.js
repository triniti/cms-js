import { all, fork, takeLatest } from 'redux-saga/effects';
import { actionTypes } from '../constants';

import startMedialiveChannelFlow from './startMedialiveChannelFlow';

function* watchStartMedialiveChannelFlow() {
  yield takeLatest(actionTypes.START_MEDIALIVE_CHANNEL_REQUESTED, startMedialiveChannelFlow);
}

export default function* rootSaga() {
  yield all([
    fork(watchStartMedialiveChannelFlow),
  ]);
}
