import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';

const delay = (s) => new Promise((resolve) => setTimeout(resolve, s));

export const getUploadUrls = () => {
  // todo: remove me
};

const defaultGetTestUrl = (assetId) => {
  const d = new Date();
  const rand = `?r=${d.getTime()}${d.getMilliseconds()}`;
  return `${damUrl(assetId)}${rand}`;
};

const checkUrl = async (url) => {
  const response = await fetch(url, {
    method: 'HEAD',
    /*
    credentials: 'include',
    mode: 'cors',
     */
    cache: 'no-cache',
  });

  if (response.status === 200 || response.status === 304) {
    return;
  }

  throw new Error(`${url} doesn't exist.`);
};

const MAX_CHECKS = 3;

export default async (options) => {
  const {
    assetId,
    s3PresignedUrl,
    file,
    controller,
    getTestUrl = defaultGetTestUrl,
    testUpload = false
  } = options;
  // await delay(3000); // for testing UI states

  let failed;

  try {
    const response = await fetch(s3PresignedUrl, {
      signal: controller.signal,
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': file.type || 'application/octet-stream',
        'Cache-Control': 'max-age=31536000',
      },
      body: file
    });

    failed = response.status !== 200;
  } catch (e) {
    console.error('uploadFile', assetId, s3PresignedUrl, getFriendlyErrorMessage(e));
    failed = true;
  }

  if (failed) {
    throw new Error(controller.signal.aborted ? `Upload canceled for ${file.name}.` : `Upload failed for ${file.name}.`);
  }

  if (testUpload) {
    let testUrl = getTestUrl(assetId);
    if (testUrl) {
      for (let checked = 0; checked < MAX_CHECKS; checked += 1) {
        try {
          await checkUrl(testUrl);
          break;
        } catch (e) {
          await delay(500);
          testUrl = getTestUrl(assetId);
        }
      }
    }
  }
};

