import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';

/**
 * @param {Object} state - The entire redux state.
 * @param {Object} ownProps
 *
 * @returns {Object}
 */
export default (state, { selectedRef }) => ({
  selected: getNode(state, selectedRef),
});
