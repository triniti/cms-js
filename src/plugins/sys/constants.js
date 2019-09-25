export const PLUGIN_PREFIX = '@triniti/sys/';
const t = (id) => `${PLUGIN_PREFIX}${id}`;

export const serviceIds = {
  FLAGSET_SUBSCRIBER: t('flagset_subscriber'),
  PICKLIST_SUBSCRIBER: t('picklist_subscriber'),
  PREFIX: PLUGIN_PREFIX,
  REDIRECT_SUBSCRIBER: t('redirect_subscriber'),
  VANITY_URLABLE_SUBSCRIBER: t('vanity_urlable_subscriber'),
};

export const routeIds = {
  PREFIX: PLUGIN_PREFIX,

  INDEX: t('index'),
  LIST_ALL_FLAGSETS: t('list_all_flagsets'),
  LIST_ALL_PICKLISTS: t('list_all_picklists'),
  FLAGSET: t('flagset'),
  PICKLIST: t('picklist'),
  REDIRECT: t('redirect'),
  SEARCH_REDIRECTS: t('search_redirects'),
};

export const formNames = {
  FLAGSET: t('flagset'),
  CREATE_FLAGSET: t('create_flagset'),
  CREATE_PICKLIST: t('create_picklist'),
  CREATE_REDIRECT: t('create_redirect'),
  PICKLIST: t('picklist'),
  REDIRECT: t('redirect'),
};

export const pbjxChannelNames = {
  REDIRECT_SEARCH: t('redirectSearch'),
  PICKLIST_PICKER_REQUEST: t('picklistPickerRequest'),
};
