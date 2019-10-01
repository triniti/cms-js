import { all, fork, takeLatest } from 'redux-saga/effects';
import { actionTypes, serviceIds } from '../constants';
import connectionFlow from './connectionFlow';
import pollCollaborationsFlow from './pollCollaborationsFlow';
import publishFlow from './publishFlow';
import receiveFlow from './receiveFlow';

function* watchCollaborations() {
  yield takeLatest(actionTypes.CONNECTION_REQUESTED, pollCollaborationsFlow);
}

function* watchMessages() {
  yield takeLatest(actionTypes.CONNECTION_REQUESTED, receiveFlow);
}

export default function* rootSaga(app) {
  const container = app.getContainer();
  const raven = container.get(serviceIds.RAVEN);
  yield all([
    fork(connectionFlow, raven),
    fork(publishFlow, raven),
    fork(watchCollaborations),
    fork(watchMessages),
  ]);
}
