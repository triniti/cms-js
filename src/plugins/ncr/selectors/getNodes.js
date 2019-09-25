import getNode from './getNode';

/**
 * Returns an object containing nodes keyed by their NodeRef.
 *
 * @param {{ncr: {}}} state    - The entire redux state.
 * @param {NodeRef[]} nodeRefs - An array of NodeRef instances.
 *
 * @returns {Object.<Message>} - Messages (key is NodeRef) using mixin 'gdbots:ncr:mixin:node'
 */
export default (state, nodeRefs) => (
  nodeRefs.reduce((nodes, nodeRef) => {
    const node = getNode(state, nodeRef);
    if (node !== null) {
      nodes[nodeRef.toString()] = node; // eslint-disable-line no-param-reassign
    }

    return nodes;
  }, {})
);
