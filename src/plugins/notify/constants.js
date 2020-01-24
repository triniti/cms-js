export const PLUGIN_PREFIX = '@triniti/notify/';
const t = (id) => `${PLUGIN_PREFIX}${id}`;

export const serviceIds = {
  PREFIX: PLUGIN_PREFIX,

  ANDROID_NOTIFICATION_SUBSCRIBER: t('android_notification_subscriber'),
  EMAIL_NOTIFICATION_SUBSCRIBER: t('email_notification_subscriber'),
  IOS_NOTIFICATION_SUBSCRIBER: t('ios_notification_subscriber'),
  NOTIFICATION_ENRICHER: t('notification_enricher'),
  NOTIFICATION_SUBSCRIBER: t('notification_subscriber'),
};

export const routeIds = {
  PREFIX: PLUGIN_PREFIX,

  SEARCH_NOTIFICATIONS: t('search_notifications'),
  NOTIFICATION: t('notification'),

  INDEX: t('index'),
};

export const actionTypes = {
  PREFIX: PLUGIN_PREFIX,
};

export const formNames = {
  CREATE_NOTIFICATION: t('create_notification'),
  NOTIFICATION: t('notification'),
};

export const formConfigs = {
  CONTENT_TYPE: {
    ARTICLE: 'article',
    VIDEO: 'video',
    GALLERY: 'gallery',
    GENERAL_MESSAGE: 'general-message',
  },
  SEND_OPTIONS: {
    SEND_NOW: 'send-now',
    SCHEDULE_SEND: 'schedule-send',
    SEND_ON_PUBLISH: 'send-on-publish',
    DISABLE_SEND_NOW: [
      { label: 'Schedule Send', value: 'schedule-send' },
      { label: 'Send on Publish', value: 'send-on-publish' },
    ],
    DISABLE_SEND_ON_PUBLISH: [
      { label: 'Send Now', value: 'send-now' },
      { label: 'Schedule Send', value: 'schedule-send' },
      {
        label: 'Send on Publish (content has already been published or can\'t be published)',
        value: 'send-on-publish',
        disabled: true,
      },
    ],
  },
};

export const pbjxChannel = {
  ARTICLE_NOTIFICATIONS: 'article-notifications',
};
