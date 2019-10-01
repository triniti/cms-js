import getAuthenticatedUserRef from '@triniti/cms/plugins/iam/selectors/getAuthenticatedUserRef';

/**
 * @param {Object}         state
 * @param {NodeRef|string} nodeRef
 *
 * @returns {boolean}
 */
export default (state, nodeRef) => {
  const topic = `${nodeRef}`;

  if (!state.raven.collaboration[topic]) {
    return false;
  }

  const userRef = `${getAuthenticatedUserRef(state)}`;
  return !!state.raven.collaboration[topic][userRef];
};
