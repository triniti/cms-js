import getAuthenticatedUser from './getAuthenticatedUser';

/**
 * @param {Object} state
 *
 * @returns {NodeRef}
 */
export default (state) => getAuthenticatedUser(state).get('_id').toNodeRef();
