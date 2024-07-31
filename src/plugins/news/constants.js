export const PLUGIN_PREFIX = 'news/';
const t = id => `${PLUGIN_PREFIX}${id}`;

export const actionTypes = {
  PREFIX: PLUGIN_PREFIX,
};

export const serviceIds = {
  PREFIX: PLUGIN_PREFIX,
  HEADLINE_FRAGMENTS_SUBSCRIBER: t('headline_fragments_subscriber'),
};
