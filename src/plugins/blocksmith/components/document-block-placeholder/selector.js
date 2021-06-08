import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';

/**
 * @param {Object} state      - The entire redux state.
 * @param {{ node }} ownProps - Props given to the component.
 *
 * @returns {Object}
 */
export default (state, { node }) => ({
  image: getNode(state, node.get('image_ref')),
  imageRef: node.get('image_ref'),
  node: getNode(state, node.get('node_ref')),
  nodeRef: node.get('node_ref'),
});
