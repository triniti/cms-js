import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';

/**
 * @param {Object} state       - The entire redux state.
 * @param {{ block }} ownProps - Props given to the component.
 *
 * @returns {Object}
 */
export default (state, { block }) => ({
  image: block.has('node_ref') ? getNode(state, block.get('node_ref')) : null,
});
