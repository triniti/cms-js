export const PLUGIN_PREFIX = '@triniti/canvas/';
const t = (id) => `${PLUGIN_PREFIX}${id}`;

export const routeIds = {
  PREFIX: PLUGIN_PREFIX,

  PAGE: t('page'),
  SEARCH_PAGES: t('search_pages'),

  INDEX: t('index'),
};

export const actionTypes = {
  PREFIX: PLUGIN_PREFIX,
};

export const formNames = {
  PAGE: t('page'),
  CREATE_PAGE: t('create_page'),
  SEARCH_PAGES: t('search_pages'),
};

export const serviceIds = {
  PREFIX: PLUGIN_PREFIX,
  PAGE_SUBSCRIBER: t('page_subscriber'),
  HAS_BLOCKS_SUBSCRIBER: t('has_blocks_subscriber'),
  LAYOUTS: t('layouts'),
};

export const pbjxChannelNames = {
  PAGE_SEARCH: t('pageSearch'),
};
