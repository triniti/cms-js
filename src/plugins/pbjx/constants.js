export const PLUGIN_PREFIX = 'pbjx/';
const t = id => `${PLUGIN_PREFIX}${id}`;

export const serviceIds = {
  PREFIX: PLUGIN_PREFIX,
  MESSAGE_BINDER: t('message_binder'),
};

export const actionTypes = {
  PREFIX: PLUGIN_PREFIX,

  ENVELOPE_RECEIVED: t('ENVELOPE_RECEIVED'),
  REQUEST_CLEARED: t('REQUEST_CLEARED'),
  REQUEST_PERSISTED: t('REQUEST_PERSISTED'),
  FULFILLED: t('FULFILLED'),
};

