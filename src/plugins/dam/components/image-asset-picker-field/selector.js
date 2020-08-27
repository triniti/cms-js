import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';

/**
 * @param {Object} state - The entire redux state.
 *
 * @returns {Object}
 */
export default (state) => ({
  getNode: (ref) => getNode(state, ref),
});
