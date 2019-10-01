export const PLUGIN_PREFIX = '@triniti/utils/';

const t = (id) => `${PLUGIN_PREFIX}${id}`;

export const actionTypes = {
  PREFIX: PLUGIN_PREFIX,

  COUNTER_UPDATED: t('COUNTER_UPDATED'),
};
