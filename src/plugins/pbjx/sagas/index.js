import { all, fork, takeLatest } from 'redux-saga/effects';
import testFlow from '@triniti/cms/plugins/pbjx/sagas/testFlow.js';

function* watchTest(app) {
  yield takeLatest('pbjxTest', testFlow, app);
}

export default function* rootSaga(app) {
  yield all([
    fork(watchTest, app),
  ]);
}
