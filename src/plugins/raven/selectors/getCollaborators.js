/**
 * @param {Object}         state
 * @param {NodeRef|string} nodeRef
 * @param {number}         threshold - how far back in seconds a user is considered alive
 *
 * @returns {NodeRef|string[]}
 */
export default (state, nodeRef, threshold = 15) => {
  if (!state.raven.collaborations[nodeRef]) {
    return [];
  }

  // an object of { 'user_ref': unix_timestamp }
  const users = state.raven.collaborations[nodeRef];

  // this prevents us from ever showing a collaborator who
  // hasn't sent a heartbeat within X seconds
  const aliveAfter = Math.floor(Date.now() / 1000) - threshold;

  return Object.entries(users).reduce((refs, [ref, ts]) => {
    if (ts < aliveAfter) {
      // don't include dead users
      return refs;
    }

    refs.push(ref);
    return refs;
  }, []);
};
