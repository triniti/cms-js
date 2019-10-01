import { call, put, take } from 'redux-saga/effects';
import fileToArrayBuffer from '../utils/fileToArrayBuffer';
import failProcessOneFile from '../actions/failProcessOneFile';

/**
 * Reads file contents to buffer as a worker.
 *
 * @param readFileChannel
 */
export default function* (readFileChannel) {
  while (true) {
    const {
      hashName,
      processOneFileChannel,
      preSignedUrl,
      fileInfo,
      action,
    } = yield take(readFileChannel);

    try {
      const fileBuffer = yield call(fileToArrayBuffer, fileInfo.file);
      yield put(processOneFileChannel, { hashName, fileInfo, fileBuffer, preSignedUrl, action });
    } catch (e) {
      const error = {
        err: 'FILE_READ',
        msg: 'Failed to read file.',
        // This info is needed to send to retry flow
        retry: {
          preSignedUrl,
        },
      };
      yield put(failProcessOneFile(hashName, error));
    }
  }
}
