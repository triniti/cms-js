import { all, fork, takeLatest } from 'redux-saga/effects';
import { actionTypes } from '../constants';

import batchOperationFlow from './batchOperationFlow';
import cloneNodeFlow from './cloneNodeFlow';
import createNodeFlow from './createNodeFlow';
import deleteNodeFlow from './deleteNodeFlow';
import lockNodeFlow from './lockNodeFlow';
import markNodeAsDraftFlow from './markNodeAsDraftFlow';
import markNodeAsPendingFlow from './markNodeAsPendingFlow';
import publishNodeFlow from './publishNodeFlow';
import renameNodeFlow from './renameNodeFlow';
import searchNodesFlow from './searchNodesFlow';
import unlockNodeFlow from './unlockNodeFlow';
import unpublishNodeFlow from './unpublishNodeFlow';
import updateNodeFlow from './updateNodeFlow';
import updateNodeLabelsFlow from './updateNodeLabelsFlow';
import createSafeSaga from '../utils/createSafeSaga';

function* watchBatchOperations() {
  const {
    BATCH_DELETE_NODES_REQUESTED,
    BATCH_MARK_NODES_AS_DRAFT_REQUESTED,
    BATCH_PUBLISH_NODES_REQUESTED,
  } = actionTypes;
  yield takeLatest(
    [
      BATCH_DELETE_NODES_REQUESTED,
      BATCH_MARK_NODES_AS_DRAFT_REQUESTED,
      BATCH_PUBLISH_NODES_REQUESTED,
    ],
    batchOperationFlow,
  );
}

function* watchCloneNodeFlow() {
  yield takeLatest(actionTypes.CLONE_NODE_REQUESTED, cloneNodeFlow);
}

function* watchCreateNodeFlow() {
  yield takeLatest(actionTypes.CREATE_NODE_REQUESTED, createNodeFlow);
}

function* watchDeleteNodeFlow() {
  yield takeLatest(actionTypes.DELETE_NODE_REQUESTED, deleteNodeFlow);
}

function* watchLockNodeFlow() {
  yield takeLatest(actionTypes.LOCK_NODE_REQUESTED, lockNodeFlow);
}

function* watchMarkNodeAsDraftFlow() {
  yield takeLatest(actionTypes.MARK_NODE_AS_DRAFT_REQUESTED, markNodeAsDraftFlow);
}

function* watchMarkNodeAsPendingFlow() {
  yield takeLatest(actionTypes.MARK_NODE_AS_PENDING_REQUESTED, markNodeAsPendingFlow);
}

function* watchPublishNodeFlow() {
  yield takeLatest(actionTypes.PUBLISH_NODE_REQUESTED, publishNodeFlow);
}

function* watchRenameNodeFlow() {
  yield takeLatest(actionTypes.RENAME_NODE_REQUESTED, renameNodeFlow);
}

function* watchSearchNodes() {
  yield takeLatest(actionTypes.SEARCH_NODES_REQUESTED, searchNodesFlow);
}

function* watchUnlockNodeFlow() {
  yield takeLatest(actionTypes.UNLOCK_NODE_REQUESTED, unlockNodeFlow);
}

function* watchUnpublishNodeFlow() {
  yield takeLatest(actionTypes.UNPUBLISH_NODE_REQUESTED, unpublishNodeFlow);
}

function* watchUpdateNodeFlow() {
  yield takeLatest(actionTypes.UPDATE_NODE_REQUESTED, createSafeSaga(updateNodeFlow));
}

function* watchUpdateNodeLabelsFlow() {
  yield takeLatest(actionTypes.UPDATE_NODE_LABELS_REQUESTED, updateNodeLabelsFlow);
}

export default function* rootSaga() {
  yield all([
    fork(watchBatchOperations),
    fork(watchCloneNodeFlow),
    fork(watchCreateNodeFlow),
    fork(watchDeleteNodeFlow),
    fork(watchLockNodeFlow),
    fork(watchMarkNodeAsDraftFlow),
    fork(watchMarkNodeAsPendingFlow),
    fork(watchPublishNodeFlow),
    fork(watchRenameNodeFlow),
    fork(watchSearchNodes),
    fork(watchUnlockNodeFlow),
    fork(watchUnpublishNodeFlow),
    fork(watchUpdateNodeFlow),
    fork(watchUpdateNodeLabelsFlow),
  ]);
}
