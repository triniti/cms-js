import getBlocksmith from '@triniti/cms/plugins/blocksmith/selectors/getBlocksmith';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';

/**
 * @param {Object} state - The entire redux state.
 * @param {Object} ownProps
 *
 * @returns {Object}
 */
export default (state, { formName }) => ({
  blocksmithState: getBlocksmith(state, formName),
  getNode: (nodeRef) => getNode(state, nodeRef),
});
