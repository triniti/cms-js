import getUserRef from '@triniti/cms/plugins/iam/selectors/getUserRef.js';

/**
 * @param {Object}         state
 * @param {NodeRef|string} nodeRef
 *
 * @returns {boolean}
 */
export default (state, nodeRef) => {
  const topic = `${nodeRef}`;
  const userRef = `${getUserRef(state)}`;
  return !!state.raven.collaborations?.[topic]?.[userRef];
};
