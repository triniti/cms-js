export const PLUGIN_PREFIX = '@triniti/pbjx/';
const t = (id) => `${PLUGIN_PREFIX}${id}`;

export const serviceIds = {
  PREFIX: PLUGIN_PREFIX,
  CTX_BINDER: t('binders/ctx_binder'),
};

export const actionTypes = {
  PREFIX: PLUGIN_PREFIX,
  ENVELOPE_RECEIVED: t('ENVELOPE_RECEIVED'),
  CHANNEL_CLEARED: t('CHANNEL_CLEARED'),
  RESPONSE_CLEARED: t('RESPONSE_CLEARED'),
};
