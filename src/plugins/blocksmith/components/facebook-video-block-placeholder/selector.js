import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';

/**
 * @param {Object} state      - The entire redux state.
 * @param {{ node }} ownProps - Props given to the component.
 *
 * @returns {Object}
 */
export default (state, { node }) => ({
  image: node.has('poster_image_ref') ? getNode(state, node.get('poster_image_ref')) : null,
});
