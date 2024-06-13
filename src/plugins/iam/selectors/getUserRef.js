import getUser from '@triniti/cms/plugins/iam/selectors/getUser.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';

/**
 * @param {Object} state
 *
 * @returns {NodeRef}
 */
export default (state) => NodeRef.fromNode(getUser(state));
