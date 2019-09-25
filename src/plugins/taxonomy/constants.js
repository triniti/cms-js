const PLUGIN_PREFIX = '@triniti/taxonomy/';

const t = (id) => `${PLUGIN_PREFIX}${id}`;

export default PLUGIN_PREFIX;

export const formNames = {
  CATEGORY: t('category'),
  CHANNEL: t('channel'),
  CREATE_CATEGORY: t('create_category'),
  CREATE_CHANNEL: t('create_channel'),
};

export const routeIds = {
  PREFIX: PLUGIN_PREFIX,

  INDEX: t('index'),
  CATEGORY: t('category'),
  CHANNEL: t('channel'),
  SEARCH_CATEGORIES: t('search_categories'),
  SEARCH_CHANNELS: t('search_channels'),
};

export const serviceIds = {
  PREFIX: PLUGIN_PREFIX,
  CATEGORIZABLE_SUBSCRIBER: t('categorizable_subscriber'),
  CATEGORY_SUBSCRIBER: t('category_subscriber'),
  CHANNEL_SUBSCRIBER: t('channel_subscriber'),
  HAS_CHANNEL_SUBSCRIBER: t('has_channel_subscriber'),
  HASHTAGGABLE_SUBSCRIBER: t('hashtaggable_subscriber'),
};
