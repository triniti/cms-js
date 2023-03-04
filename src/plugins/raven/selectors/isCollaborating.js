import getUserRef from 'plugins/iam/selectors/getUserRef';

/**
 * @param {Object}         state
 * @param {NodeRef|string} nodeRef
 *
 * @returns {boolean}
 */
export default (state, nodeRef) => {
  const topic = `${nodeRef}`;

  if (!state.raven.collaborations[topic]) {
    return false;
  }

  const userRef = `${getUserRef(state)}`;
  return !!state.raven.collaborations[topic][userRef];
};
