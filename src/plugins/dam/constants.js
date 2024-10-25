export const PLUGIN_PREFIX = 'dam/';
const t = id => `${PLUGIN_PREFIX}${id}`;

export const uploadStatus = {
  UPLOADING: 'uploading',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELED: 'canceled',
};

export const aspectRatios = {
  '16by9': 'Widescreen - 16:9',
  '5by4': 'Horizontal - 5:4',
  '4by3': 'Horizontal - 4:3',
  '3by2': 'Horizontal - 3:2',
  '1by1': 'Square - 1:1',
  '2by3': 'Vertical - 2:3',
  '3by4': 'Vertical - 3:4',
  '4by5': 'Vertical - 4:5',
  '5by6': 'Gallery - 5:6',
  '6by5': 'Gallery - 6:5',
  '9by16': 'Long Vertical - 9:16',
};
