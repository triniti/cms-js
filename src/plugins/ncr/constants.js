export const PLUGIN_PREFIX = 'ncr/';
const t = id => `${PLUGIN_PREFIX}${id}`;

export const serviceIds = {
  PUBLISH_NODE_VALIDATOR: t('publish_node_validator'),
};

export const actionTypes = {
  PRUNE_NODES: t('prune_nodes'),
  NODES_RECEIVED: t('nodes_received'),
};
