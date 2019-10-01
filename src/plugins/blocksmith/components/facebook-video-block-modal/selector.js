import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';

/**
 * @param {Object} state       - The entire redux state.
 * @param {{ block }} ownProps - Props given to the screen.
 *
 * @returns {Object}
 */
export default (state, { block }) => ({
  imageNode: block.has('poster_image_ref') ? getNode(state, block.get('poster_image_ref')) : null,
});
