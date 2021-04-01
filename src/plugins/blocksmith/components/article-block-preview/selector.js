import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';

/**
 * @param {Object} state       - The entire redux state.
 * @param {{ block }} ownProps - Props given to the component.
 *
 * @returns {Object}
 */
export default (state, { block }) => ({
  articleNode: getNode(state, block.get('node_ref')),
  imageRef: block.get('image_ref'),
});
