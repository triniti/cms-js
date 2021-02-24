import { call, delay, put } from 'redux-saga/effects';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import failProcessOneFile from '../actions/failProcessOneFile';
import fulfillUpload from '../actions/fulfillUpload';
import startUpload from '../actions/startUpload';

const MAX_RETRIES = 3;

const checkImage = (url) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = resolve;
  img.onerror = reject;
  img.src = url;
});

/**
 * Uploads file to preSigned url
 *
 * @param hashName
 * @param fileInfo
 * @param fileBuffer
 * @param preSignedUrl
 * @param {Object} variant
 */
export default function* (hashName, fileInfo, fileBuffer, preSignedUrl, variant) {
  // Return early if already uploaded
  if (fileInfo.uploaded) {
    return true;
  }

  for (let retries = 0; retries < MAX_RETRIES; retries += 1) {
    try {
      // Delay the process by 2 seconds if this isn't the first try
      if (retries) {
        yield delay(2000);
      }

      yield put(startUpload(hashName));

      // @fixme Attach metadata headers for asset id, causator, etc.
      const response = yield call(fetch, preSignedUrl, {
        method: 'put',
        body: fileBuffer,
        headers: {
          Accept: 'application/json',
          'Content-Type': fileInfo.file.type || 'application/octet-stream',
        },
      });

      if (response.status !== 200) {
        throw new Error(`dam upload file flow failed on try #${retries}. trying again.`);
      }

      const { version } = variant;
      const { asset } = fileInfo;
      const { type } = asset.get('_id');

      let previewUrl = damUrl(asset);
      if (type === 'image') {
        previewUrl = damUrl(asset, version, 'sm');
        yield checkImage(previewUrl);
      }

      yield put(fulfillUpload(hashName, previewUrl));
      fileInfo.previewUrl = previewUrl; // eslint-disable-line no-param-reassign

      // End loop and saga
      return true;
    } catch (e) {
      yield put(e);

      if (retries + 1 === MAX_RETRIES) {
        const error = {
          err: 'UPLOAD',
          msg: 'Failed to upload asset.',
          // This info is needed to send to retry flow
          retry: {
            fileBuffer,
            preSignedUrl,
          },
        };
        yield put(failProcessOneFile(hashName, error));

        throw e;
      }
    }
  }

  // Consistent return
  return true;
}
