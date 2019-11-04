export const PLUGIN_PREFIX = '@triniti/ncr/';
const t = (id) => `${PLUGIN_PREFIX}${id}`;

export const serviceIds = {
  PREFIX: PLUGIN_PREFIX,

  CONSISTENT_READ_ENRICHER: t('consistent_read_enricher'),
  EXPIRABLE_SUBSCRIBER: t('expirable_subscriber'),
  LOCKABLE_ENRICHER: t('lockable_enricher'),
  SLUGGABLE_FORMS: t('sluggable_forms'),
  SLUGGABLE_SUBSCRIBER: t('sluggable_subscriber'),
  PUBLISH_NODE_VALIDATOR: t('publish_node_validator'),
};

export const actionTypes = {
  PREFIX: PLUGIN_PREFIX,

  BATCH_DELETE_NODES_REQUESTED: t('BATCH_DELETE_NODES_REQUESTED'),
  BATCH_MARK_NODES_AS_DRAFT_REQUESTED: t('BATCH_MARK_NODES_AS_DRAFT_REQUESTED'),
  BATCH_PUBLISH_NODES_REQUESTED: t('BATCH_PUBLISH_NODES_REQUESTED'),
  BATCH_OPERATION_STARTED: t('BATCH_OPERATION_STARTED'),
  BATCH_OPERATION_ENDED: t('BATCH_OPERATION_ENDED'),
  BATCH_OPERATION_PAUSED: t('BATCH_OPERATION_PAUSED'),
  BATCH_OPERATION_UPDATED: t('BATCH_OPERATION_UPDATED'),
  BATCH_OPERATION_DESTROYED: t('BATCH_OPERATION_DESTROYED'),
  BATCH_OPERATION_RESUMED: t('BATCH_OPERATION_RESUMED'),

  CLONE_NODE_REQUESTED: t('CLONE_NODE_REQUESTED'),
  CREATE_NODE_REQUESTED: t('CREATE_NODE_REQUESTED'),
  DELETE_NODE_REQUESTED: t('DELETE_NODE_REQUESTED'),
  LOCK_NODE_REQUESTED: t('LOCK_NODE_REQUESTED'),
  MARK_NODE_AS_DRAFT_REQUESTED: t('MARK_NODE_AS_DRAFT_REQUESTED'),
  MARK_NODE_AS_PENDING_REQUESTED: t('MARK_NODE_AS_PENDING_REQUESTED'),
  PUBLISH_NODE_REQUESTED: t('PUBLISH_NODE_REQUESTED'),
  RENAME_NODE_REQUESTED: t('RENAME_NODE_REQUESTED'),
  SEARCH_NODES_REQUESTED: t('SEARCH_NODES_REQUESTED'),
  SEARCH_NODES_VIEW_CHANGED: t('SEARCH_NODES_VIEW_CHANGED'),
  UNLOCK_NODE_REQUESTED: t('UNLOCK_NODE_REQUESTED'),
  UPDATE_NODE_REQUESTED: t('UPDATE_NODE_REQUESTED'),
  UNPUBLISH_NODE_REQUESTED: t('UNPUBLISH_NODE_REQUESTED'),
};

export const batchOperationStatuses = {
  DESTROYED: t('DESTROYED'),
  ENDED: t('ENDED'),
  PAUSED: t('PAUSED'),
  PENDING: t('PENDING'),
  RESUMED: t('RESUMED'),
  STARTED: t('STARTED'),
};

export const batchOperationMessageTypes = {
  CONFIRMATION: t('CONFIRMATION'),
  ERROR: t('ERROR'),
};

export const batchOperationResponseStatus = {
  TIMED_OUT: t('TIMED_OUT'),
};

export const searchViewTypes = {
  CARD: t('CARD'),
  TABLE: t('TABLE'),
};

export const selectActionTypes = {
  DESELECT_OPTION: 'deselect-option',
  SELECT_OPTION: 'select-option',
  REMOVE_VALUE: 'remove-value',
  CLEAR: 'clear',
};
