import getUser from './getUser';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';

/**
 * @param {Object} state
 *
 * @returns {NodeRef}
 */
export default (state) => NodeRef.fromNode(getUser(state));
