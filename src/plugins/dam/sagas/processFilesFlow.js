import { flush, put, putResolve, select } from 'redux-saga/effects';
import updateCounter from '@triniti/cms/plugins/utils/actions/updateCounter';
import { actionTypes, utilityTypes } from '../constants';
import getFileList from '../selectors/getFileList';

/**
 * Retrieve preSigned urls and attach them to
 *
 * @param {Channel} processOneFileChannel
 * @param {Channel} readFileChannel
 * @param {Object} action
 */
function* preSignedUrlsFlow(processOneFileChannel, readFileChannel, action) {
  // File names to get preSigned urls
  const { files, config, variant = {} } = action;
  const { schemas } = config;
  const fileNames = Object.keys(files).map((hashName) => files[hashName].uuidName);

  const uploadUrlsRequest = schemas.getUploadUrlsRequest.createMessage().addToList('files', fileNames);
  if (variant.version && variant.asset) {
    uploadUrlsRequest.set('version', variant.version);
    uploadUrlsRequest.set('asset_id', variant.asset.get('_id'));
  }

  const uploadUrlsResult = yield putResolve(uploadUrlsRequest);
  const preSignedUrls = uploadUrlsResult.pbj.get('s3_presigned_urls');

  // Note: Asset ids are merged into the state by a reducer bound to the getUploadUrlsRequest
  // response.
  // @see ../reducers/uploader.js

  // Re-select files due to reducers changing store state
  const latestFileInfo = yield select(getFileList);

  // Send jobs to channel for processing
  /* eslint guard-for-in: off */
  /* eslint no-restricted-syntax: off */
  for (const hashName in files) {
    // Start processing the reading in of files as quick as possible
    yield put(readFileChannel, {
      hashName,
      processOneFileChannel,
      preSignedUrl: preSignedUrls[hashName],
      fileInfo: latestFileInfo[hashName],
      action,
    });
  }
}

/**
 * Sends the job to a specific flow depending on the error.
 *
 * @param {Channel} processOneFileChannel
 * @param {Channel} readFileChannel
 * @param {String} hashName
 */
function* retryFlow(processOneFileChannel, readFileChannel, { hashName, error }) {
  const files = yield select(getFileList);
  const fileInfo = files[hashName];

  // Where to go from here
  switch (error.err) {
    case 'NODE_SAVE':
    case 'UPLOAD':
      yield put(processOneFileChannel, {
        ...error.retry,
        hashName,
        fileInfo,
      });
      break;
    case 'FILE_READ':
    default:
      yield put(readFileChannel, {
        ...error.retry,
        hashName,
        processOneFileChannel,
        fileInfo,
      });
      break;
  }
}

/**
 * Process Files Flow
 *
 * @param {Channel} processOneFileChannel
 * @param {Channel} readFileChannel
 * @param {Object} action
 */
export default function* (processOneFileChannel, readFileChannel, action) {
  const { files, galleryRef, type } = action;
  switch (type) {
    case actionTypes.PROCESS_FILES_REQUESTED:
      yield preSignedUrlsFlow(processOneFileChannel, readFileChannel, action);

      if (galleryRef) {
        const highestSequence = Object.keys(files)
          .map((hashName) => files[hashName].gallerySequence)
          .reduce((accumulator, sequence) => (accumulator >= sequence ? accumulator : sequence), 0);
        yield put(updateCounter(utilityTypes.GALLERY_SEQUENCE_COUNTER, highestSequence));
      }
      break;

    case actionTypes.PROCESS_FILE_RETRY_REQUESTED:
      yield retryFlow(processOneFileChannel, readFileChannel, action);
      break;

    case actionTypes.FLUSH_PROCESSED_FILES_CHANNELS_REQUESTED:
      yield flush(processOneFileChannel);
      yield flush(readFileChannel);
      break;

    default:
      break;
  }
}
