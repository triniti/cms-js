import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import hasNode from './hasNode';

/**
 * Returns a node by its NodeRef
 *
 * @param {{ncr: {}}} state   - The entire redux state.
 * @param {NodeRef|string} ref - A NodeRef instance or a NodeRef string.
 *
 * @returns {?Message} A message using mixin 'gdbots:ncr:mixin:node'
 */
export default (state, ref) => {
  if (!ref) {
    return null;
  }

  let nodeRef = ref;
  if (!(nodeRef instanceof NodeRef)) {
    nodeRef = NodeRef.fromString(`${ref}`);
  }

  if (!hasNode(state, nodeRef)) {
    return null;
  }

  return state.ncr.nodes[nodeRef.getQName().getMessage()][nodeRef.getId()];
};
