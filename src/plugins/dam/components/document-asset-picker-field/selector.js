import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';

/**
 * @param {Object} state     - The entire redux state.
 * @param {Object} ownProps  - Props given to the component.
 *
 * @returns {Object}
 */
export default (state, { input }) => {
  if (!input.value) {
    return {};
  }
  return {
    currentDocument: getNode(state, NodeRef.fromString(input.value)),
  };
};
