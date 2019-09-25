import { call, put, take } from 'redux-saga/effects';
import { reset } from 'redux-form';

import AssertionFailed from '@gdbots/pbj/exceptions/AssertionFailed';
import HttpTransportFailed from '@gdbots/pbjx/exceptions/HttpTransportFailed';

import completeProcessFile from '../actions/completeProcessFile';
import failProcessOneFile from '../actions/failProcessOneFile';
import { formNames } from '../constants';
import savedProcessedFileFlow from './saveProcessedFileFlow';
import uploadFileFlow from './uploadFileFlow';

/**
 * Uploads file as a worker.
 *
 * @param processOneFileChannel
 */
export default function* (processOneFileChannel) {
  while (true) {
    const {
      hashName,
      fileBuffer,
      fileInfo,
      preSignedUrl,
      action,
    } = yield take(processOneFileChannel);
    const { variant } = action;

    try {
      // Upload file
      yield call(uploadFileFlow, hashName, fileInfo, fileBuffer, preSignedUrl, variant);

      // Save asset to db
      // Note: We only save original file info to db. Not other variants (o = original)
      if (variant.version === 'o') {
        yield call(savedProcessedFileFlow, hashName, fileInfo, action);
      } else {
        yield put(completeProcessFile(hashName));
      }
      yield put(reset(`${formNames.UPLOADER_FORM_PREFIX}${hashName}`));
    } catch (e) {
      if (
        e instanceof HttpTransportFailed
        || e instanceof AssertionFailed // @todo AssertionFailed is not a retryable error.
      // Button should not allow retry
      // if this happens
      ) {
        const error = {
          err: 'NODE_SAVE',
          msg: 'Failed to save node.',
          // This info is needed to send to retry flow
          retry: {
            fileBuffer,
            preSignedUrl,
          },
        };
        yield put(failProcessOneFile(hashName, error));
        yield put(reset(`${formNames.UPLOADER_FORM_PREFIX}${hashName}`));
      }
    }
  }
}
