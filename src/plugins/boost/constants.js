export const PLUGIN_PREFIX = '@triniti/boost/';
const t = (id) => `${PLUGIN_PREFIX}${id}`;

export const serviceIds = {
  SPONSORABLE_SUBSCRIBER: t('sponsorable_subscriber'),
  SPONSOR_SUBSCRIBER: t('sponsor_subscriber'),
  PREFIX: PLUGIN_PREFIX,
};

export const routeIds = {
  PREFIX: PLUGIN_PREFIX,

  INDEX: t('index'),
  SEARCH_SPONSORS: t('search_sponsors'),
  SPONSOR: t('sponsor'),
};

export const actionTypes = {
  PREFIX: PLUGIN_PREFIX,
};

export const formNames = {
  SPONSOR: t('sponsor'),
  CREATE_SPONSOR: t('create_sponsor'),
};
