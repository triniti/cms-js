import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';

/**
 * @param {Object} state      - The entire redux state.
 * @param {{ node }} ownProps - Props given to the component.
 *
 * @returns {Object}
 */
export default (state, { node }) => ({
  nodeRefs: node.get('node_refs'),
  getNode: (nodeRef) => getNode(state, nodeRef),
});
