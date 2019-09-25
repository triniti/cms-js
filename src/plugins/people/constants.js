export const PLUGIN_PREFIX = '@triniti/people/';
const t = (id) => `${PLUGIN_PREFIX}${id}`;

export const fieldRules = {
  DESCRIPTION_MAX_CHARACTERS: 300,
  DESCRIPTION_WARNING_CHARACTERS: 150,
};

export const serviceIds = {
  PREFIX: PLUGIN_PREFIX,
  PERSON_SUBSCRIBER: t('person_subscriber'),
  HAS_PEOPLE_SUBSCRIBER: t('has_people_subscriber'),
};

export const routeIds = {
  PREFIX: PLUGIN_PREFIX,
  INDEX: t('index'),
  SEARCH_PEOPLE: t('search_people'),
  PERSON: t('person'),
};

export const actionTypes = {
  PREFIX: PLUGIN_PREFIX,
  SEARCH_PEOPLE_VIEW_CHANGED: t('SEARCH_PEOPLE_VIEW_CHANGED'),
};

export const formNames = {
  PERSON: t('person'),
  CREATE_PERSON: t('create_person'),
};
