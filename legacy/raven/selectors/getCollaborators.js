import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode.js';
import getUser from '@triniti/cms/plugins/iam/selectors/getUser.js';

/**
 * @param {Object}         state
 * @param {NodeRef|string} nodeRef
 *
 * @returns {Message[]} Array of messages using mixin 'gdbots:iam:mixin:user'
 */
export default (state, nodeRef) => {
  const topic = `${nodeRef}`;

  if (!state.raven?.collaborations || !state.raven.collaborations[topic]) {
    return [];
  }

  const me = getUser(state);

  const userNodeRefs = state.raven.collaborations[topic];

  return userNodeRefs.reduce((nodes, ref) => {
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
