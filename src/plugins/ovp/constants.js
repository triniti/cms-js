export const PLUGIN_PREFIX = '@triniti/ovp/';
const t = (id) => `${PLUGIN_PREFIX}${id}`;

export const routeIds = {
  PREFIX: PLUGIN_PREFIX,

  LIVESTREAM: t('livestream'),
  SEARCH_VIDEOS: t('search_videos'),
  VIDEO: t('video'),
  INDEX: t('index'),
};

export const actionTypes = {
  PREFIX: PLUGIN_PREFIX,

  MEDIALIVE_CHANNEL_STARTED: t('MEDIALIVE_CHANNEL_STARTED'),
  MEDIALIVE_CHANNEL_STATUS_RECEIVED: t('MEDIALIVE_CHANNEL_STATUS_RECEIVED'),
  MEDIALIVE_CHANNEL_STOPPED: t('MEDIALIVE_CHANNEL_STOPPED'),
  START_MEDIALIVE_CHANNEL_REQUESTED: t('START_MEDIALIVE_CHANNEL_REQUESTED'),
  STOP_MEDIALIVE_CHANNEL_REQUESTED: t('STOP_MEDIALIVE_CHANNEL_REQUESTED'),
};

export const formNames = {
  CREATE_VIDEO: t('create_video'),
  VIDEO: t('video'),
};

export const serviceIds = {
  PREFIX: PLUGIN_PREFIX,
  KALTURA_ENTRY_SUBSCRIBER: t('kaltura_entry_subscriber'),
  MEDIALIVE_CHANNEL_SUBSCRIBER: t('medilive_channel_subscriber'),
  VIDEO_SUBSCRIBER: t('video_subscriber'),
};

export const pbjxChannelNames = {
  VIDEO_SEARCH: t('videoSearch'),
  LIVESTREAM_VIDEO_SEARCH: t('livestreamVideoSearch'),
};
