export const PLUGIN_PREFIX = 'dam/';
const t = id => `${PLUGIN_PREFIX}${id}`;

export const uploadStatus = {
  UPLOADING: 'uploading',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELED: 'canceled',
};
