export const PLUGIN_PREFIX = 'raven/';
const t = id => `${PLUGIN_PREFIX}${id}`;

export const serviceIds = {
  RAVEN_WORKER: 'raven_worker',
};

export const actionTypes = {
  PREFIX: PLUGIN_PREFIX,
  PRUNE_COLLABORATORS: t('prune_collaborators'),
  PUBLISH_EVENT: t('publish_event'),
  EVENT_PUBLISHED: t('event_published'),
  CONNECTING: t('connecting'),
  CONNECTED: t('connected'),
  CONNECT_FAILED: t('connect_failed'),
  DISCONNECTED: t('disconnected'),
  COLLABORATOR_JOINED: t('collaborator_joined'),
  COLLABORATOR_LEFT: t('collaborator_left'),
  HEARTBEAT: t('heartbeat'),
};

export const methods = {
  START: 'start',
  CONNECT: 'connect',
  RECONNECT: 'reconnect',
  DISCONNECT: 'disconnect',
  JOIN_COLLABORATION: 'joinCollaboration',
  LEAVE_COLLABORATION: 'leaveCollaboration',
  SUBSCRIBE: 'subscribe',
  UNSUBSCRIBE: 'unsubscribe',
  HEARTBEAT: 'heartbeat',
};

export const connectionStatus = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  FAILED: 'failed',
};
