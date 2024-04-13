import { getInstance } from '@app/main';
import GetUploadUrlsRequestV1 from '@triniti/schemas/triniti/dam/request/GetUploadUrlsRequestV1';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage';

const delay = (s) => new Promise((resolve) => setTimeout(resolve, s));

export const getUploadUrls = async (files, variant = {}) => {
  const app = getInstance();
  const pbjx = await app.getPbjx();
  const fileNames = Object.keys(files).map((hashName) => files[hashName].uuidName);
  const request = GetUploadUrlsRequestV1.create().addToList('files', fileNames);
  if (variant.version && variant.asset) {
    request.set('version', variant.version);
    request.set('asset_id', variant.asset.get('_id'));
  }
  return pbjx.request(request);
};

const uploadToS3 = async (file, s3PresignedUrl, controller) => {
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
    console.error('uploadToS3', getFriendlyErrorMessage(e));
    failed = true;
  }

  if (failed) {
    throw new Error(controller.signal.aborted ? `Upload canceled for ${file.name}.` : `Upload failed for ${file.name}.`);
  }
};

const getTestUrl = (s3PresignedUrl, tenantId) => {
  const s3Url = new URL(s3PresignedUrl);
  let url = UGC_BASE_URL.substring(0, UGC_BASE_URL.length - 1);

  if (s3Url.host.includes('-static.')) {
    url = url.replace('ugc.', 'static.') + s3Url.pathname;
  } else if (s3Url.host.includes('-ugc-incoming.')) {
    return null;
  } else {
    url = url + '/' + tenantId + s3Url.pathname;
  }

  return url;
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
export default async (file, postUrl, controller) => {
  //await delay(3000); // for testing UI states
  await uploadToS3(file, postUrl, controller);
  return;


  const testUrl = getTestUrl(s3PresignedUrl, response.get('ctx_tenant_id'));
  if (testUrl) {
    for (let checked = 0; checked < MAX_CHECKS; checked += 1) {
      try {
        await checkUrl(testUrl);
        break;
      } catch (e) {
        await delay(1000);
      }
     }
  }
};