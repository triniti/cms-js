/* eslint-disable no-constant-condition */
import { buffers, channel } from 'redux-saga';
import { all, call, fork, takeEvery, takeLatest } from 'redux-saga/effects';
import { actionTypes } from '../constants';
import patchAssetsFlow from './patchAssetsFlow';
import processFilesFlow from './processFilesFlow';
import processOneFileFlow from './processOneFileFlow';
import searchAssetsFlow from './searchAssetsFlow';
import readFileFlow from './readFileFlow';
import reorderGalleryAssetsFlow from './reorderGalleryAssetsFlow';
import unlinkAssetsFlow from './unlinkAssetsFlow';
import linkAssetsFlow from './linkAssetsFlow';
import updateAssetsInUploaderFlow from './updateAssetsInUploaderFlow';

const MAX_FILE_READERS = 10; // This number should be >= MAX_FILE_UPLOADS
const MAX_FILE_UPLOADS = 3;

function* watchPatchAssets() {
  yield takeEvery([
    actionTypes.PATCH_ASSETS_REQUESTED,
  ], patchAssetsFlow);
}

function* watchProcessFiles() {
  // Create channel that will be used to throttle uploads
  const processFileChannel = yield call(channel, buffers.expanding(10));
  const readFileChannel = yield call(channel, buffers.expanding(10));

  // Create MAX_FILE_READERS(number) of worker 'threads'
  for (let i = 0; i < MAX_FILE_READERS; i += 1) {
    yield fork(readFileFlow, readFileChannel);
  }

  // Create MAX_FILE_UPLOADS(number) of worker 'threads'
  for (let i = 0; i < MAX_FILE_UPLOADS; i += 1) {
    yield fork(processOneFileFlow, processFileChannel);
  }

  yield takeEvery([
    actionTypes.FLUSH_PROCESSED_FILES_CHANNELS_REQUESTED,
    actionTypes.PROCESS_FILES_REQUESTED,
    actionTypes.PROCESS_FILE_RETRY_REQUESTED,
  ], processFilesFlow, processFileChannel, readFileChannel);
}

function* watchSearchAssets() {
  yield takeLatest(actionTypes.SEARCH_ASSETS_REQUESTED, searchAssetsFlow);
}

function* watchLinkAssets() {
  yield takeLatest(actionTypes.LINK_ASSETS_REQUESTED, linkAssetsFlow);
}

function* watchReorderGalleryAssets() {
  yield takeLatest(actionTypes.REORDER_GALLERY_ASSETS_REQUESTED, reorderGalleryAssetsFlow);
}

function* watchUnlinkAssets() {
  yield takeLatest(actionTypes.UNLINK_ASSETS_REQUESTED, unlinkAssetsFlow);
}

function* watchAssetsUpdateInUploader() {
  yield takeLatest(actionTypes.UPDATE_ASSETS_IN_UPLOADER_REQUESTED, updateAssetsInUploaderFlow);
}

export default function* rootSaga() {
  yield all([
    fork(watchPatchAssets),
    fork(watchProcessFiles),
    fork(watchSearchAssets),
    fork(watchUnlinkAssets),
    fork(watchReorderGalleryAssets),
    fork(watchLinkAssets),
    fork(watchAssetsUpdateInUploader),
  ]);
}
