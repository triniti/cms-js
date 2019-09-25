import getPolicy from './getPolicy';

/**
 * Returns true if user can perform action.  Action is
 * a string representing what a user wants to do and
 * is often a curie.
 *
 * @param {Object} state
 * @param {string} action
 *
 * @returns {boolean}
 */
export default (state, action) => (
  getPolicy(state).isGranted(action)
);
