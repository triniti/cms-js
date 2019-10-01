export const PLUGIN_PREFIX = '@triniti/apollo/';
const t = (id) => `${PLUGIN_PREFIX}${id}`;

export const serviceIds = {
  POLL_SUBSCRIBER: t('poll_subscriber'),
  HAS_POLL_SUBSCRIBER: t('has_poll_subscriber'),
  PREFIX: PLUGIN_PREFIX,
};

export const routeIds = {
  PREFIX: PLUGIN_PREFIX,

  INDEX: t('index'),
  SEARCH_POLLS: t('search_polls'),
  POLL: t('poll'),
};

export const actionTypes = {
  PREFIX: PLUGIN_PREFIX,
};

export const formNames = {
  POLL: t('poll'),
  CREATE_POLL: t('create_poll'),
};

export const pbjxChannelNames = {
  POLL_SEARCH: t('pollSearch'),
};
