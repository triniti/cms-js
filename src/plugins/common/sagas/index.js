import { actionTypes } from 'redux-form';
import { all, fork, takeLatest } from 'redux-saga/effects';
import stopSubmitFlow from './stopSubmitFlow';

function* watchStopSubmitFlow() {
  yield takeLatest(actionTypes.STOP_SUBMIT, stopSubmitFlow);
}

export default function* rootSaga() {
  yield all([
    fork(watchStopSubmitFlow),
  ]);
}
