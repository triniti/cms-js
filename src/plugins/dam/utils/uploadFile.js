import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';

export default async (options) => {
  const { assetId, s3PresignedUrl, file, controller } = options;
  // await delay(3000); // for testing UI states
  let failed;
  let error;

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
    failed = true;
    error = getFriendlyErrorMessage(e);
    console.error('uploadFile', assetId, s3PresignedUrl, error);
  }

  if (failed) {
    throw new Error(controller.signal.aborted ? `Upload canceled for ${file.name}.` : `Upload failed for ${file.name}. ${error}`);
  }
};

