import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';
import getAuthenticatedUser from '@triniti/cms/plugins/iam/selectors/getAuthenticatedUser';

/**
 * @param {Object}         state
 * @param {NodeRef|string} nodeRef
 * @param {number}         threshold - how far back in seconds a user is considered alive
 *
 * @returns {Message[]} Array of messages using mixin 'gdbots:iam:mixin:user'
 */
export default (state, nodeRef, threshold = 15) => {
  const topic = `${nodeRef}`;

  if (!state.raven.collaboration[topic]) {
    return [];
  }

  const me = getAuthenticatedUser(state);

  // an object of { 'user_node_ref': unix_timestamp }
  const objects = state.raven.collaboration[topic];

  // this prevents us from ever showing a collaborator who
  // hasn't sent a heartbeat within X seconds
  const aliveAfter = Math.floor(Date.now() / 1000) - threshold;

  return Object.entries(objects).reduce((nodes, [ref, ts]) => {
    if (ts < aliveAfter) {
      // don't include dead users
      return nodes;
    }

    const userRef = NodeRef.fromString(ref);
    if (userRef.getId() === me.get('_id').toString()) {
      nodes.push(me);
      return nodes;
    }

    const node = getNode(state, userRef);
    if (node) {
      nodes.push(node);
    }

    return nodes;
  }, []);
};
