import getAuthenticatedUser from '@triniti/cms/plugins/iam/selectors/getAuthenticatedUser';
import getCollaborators from '../../selectors/getCollaborators';

/**
 * @param {Object} state
 * @param {Object} ownProps
 *
 * @returns {Object}
 */
export default (state, { nodeRef }) => {
  const allUsers = getCollaborators(state, nodeRef, 45);
  const me = getAuthenticatedUser(state);

  const activeUserNames = allUsers
    .filter((user) => user.get('_id') !== me.get('_id'))
    .map((user) => user.get('title') || `${user.get('first_name', '')} ${user.get('last_name', '')}`);

  return {
    activeUserNames,
    me,
  };
};
