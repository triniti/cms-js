export const PLUGIN_PREFIX = 'ncr/';
const t = id => `${PLUGIN_PREFIX}${id}`;

export const serviceIds = {
  PREFIX: PLUGIN_PREFIX,
  PUBLISH_NODE_VALIDATOR: t('publish_node_validator'),
};

export const actionTypes = {
  PREFIX: PLUGIN_PREFIX,

  PRUNE_NODES: t('PRUNE_NODES'),
  NODES_RECEIVED: t('NODES_RECEIVED'),
};
