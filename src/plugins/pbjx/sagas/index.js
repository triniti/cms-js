import { all, fork, takeLatest } from 'redux-saga/effects';
import testFlow from 'plugins/pbjx/sagas/testFlow';

function* watchTest(app) {
  yield takeLatest('pbjxTest', testFlow, app);
}

export default function* rootSaga(app) {
  yield all([
    fork(watchTest, app),
  ]);
}
