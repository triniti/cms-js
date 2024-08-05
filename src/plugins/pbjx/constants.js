export const PLUGIN_PREFIX = 'pbjx/';
const t = id => `${PLUGIN_PREFIX}${id}`;

export const serviceIds = {
  MESSAGE_BINDER: t('message_binder'),
};

export const actionTypes = {
  ENVELOPE_RECEIVED: t('envelope_received'),
  REQUEST_CLEARED: t('request_cleared'),
  REQUEST_PERSISTED: t('request_persisted'),
  FULFILLED: t('fulfilled'),
};
