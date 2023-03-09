export const PLUGIN_PREFIX = '@triniti/raven/';
const t = (id) => `${PLUGIN_PREFIX}${id}`;

export const serviceIds = {
  PREFIX: PLUGIN_PREFIX,
  MQTT: t('mqtt'),
  NODE_CHANGE_WATCHER: 'node_change_watcher',
  RAVEN: 'raven',
};

export const routeIds = {
  PREFIX: PLUGIN_PREFIX,
  DASHBOARD: t('dashboard'),
};

export const actionTypes = {
  PREFIX: PLUGIN_PREFIX,

  COLLABORATOR_JOINED: t('COLLABORATOR_JOINED'),
  COLLABORATOR_LEFT: t('COLLABORATOR_LEFT'),
  HEARTBEAT: t('HEARTBEAT'),

  CONNECTION_REQUESTED: t('CONNECTION_REQUESTED'),
  CONNECTION_OPENED: t('CONNECTION_OPENED'),
  CONNECTION_CLOSED: t('CONNECTION_CLOSED'),
  CONNECTION_REJECTED: t('CONNECTION_REJECTED'),
  CONNECTION_UPDATED: t('CONNECTION_REJECTED'),

  COLLABORATIONS_UPDATED: t('COLLABORATIONS_UPDATED'),

  CURRENT_NODE_REF_SET: t('CURRENT_NODE_REF_SET'),
  PUBLISH_MESSAGE_REQUESTED: t('PUBLISH_MESSAGE_REQUESTED'),
  USER_LOADED: t('USER_LOADED'),

  // raven types as redux actions
  RT_USER_CONNECTED: t('rt/USER_CONNECTED'),
  RT_USER_DISCONNECTED: t('rt/USER_DISCONNECTED'),
  RT_COLLABORATOR_JOINED: t('rt/COLLABORATOR_JOINED'),
  RT_COLLABORATOR_LEFT: t('rt/COLLABORATOR_LEFT'),
  RT_HEARTBEAT: t('rt/HEARTBEAT'),
};

/**
 * These types are distinct from redux action types as they
 * represent messages that are published through the raven
 * client (which is Aws Iot).  On the receiving end they come
 * through the raven service's `receivedMessage()`.
 *
 * This ensures that the app is only dispatching expected
 * actions. If we allow any action to be dispatched without
 * this step a user could dispatch "DELETE_USER" with
 * an expected payload and every connected user would in
 * turn execute that action under their privileges.
 *
 * @type {Object}
 */
export const ravenTypes = {
  USER_CONNECTED: 'user_connected',
  USER_DISCONNECTED: 'user_disconnected',
  COLLABORATOR_JOINED: 'collaborator_joined',
  COLLABORATOR_LEFT: 'collaborator_left',
  HEARTBEAT: 'heartbeat',
};


export const connectionStatus = {
  REQUESTED: 'requested',
  OPENED: 'opened',
  CLOSED: 'closed',
  REJECTED: 'rejected',
};