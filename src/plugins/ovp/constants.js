export const PLUGIN_PREFIX = '@triniti/ovp/';
const t = (id) => `${PLUGIN_PREFIX}${id}`;

export const routeIds = {
  PREFIX: PLUGIN_PREFIX,

  // videos
  SEARCH_VIDEOS: t('search_videos'),
  VIDEO: t('video'),
  INDEX: t('index'),
};

export const actionTypes = {
  PREFIX: PLUGIN_PREFIX,
};

export const formNames = {
  CREATE_VIDEO: t('create_video'),
  VIDEO: t('video'),
};

export const serviceIds = {
  PREFIX: PLUGIN_PREFIX,
  KALTURA_ENTRY_SUBSCRIBER: t('kaltura_entry_subscriber'),
  VIDEO_SUBSCRIBER: t('video_subscriber'),
};

export const pbjxChannelNames = {
  VIDEO_SEARCH: t('videoSearch'),
};
