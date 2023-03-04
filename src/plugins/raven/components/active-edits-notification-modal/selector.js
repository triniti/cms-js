import getUser from 'plugins/iam/selectors/getUser';
import getCollaborators from 'plugins/raven/selectors/getCollaborators';

/**
 * @param {Object} state
 * @param {Object} ownProps
 *
 * @returns {Object}
 */
export default (state, { nodeRef }) => {
  const allUsers = getCollaborators(state, nodeRef, 45);
  const me = getUser(state);

  const activeUserNames = allUsers
    .filter((user) => user.get('_id') !== me.get('_id'))
    .map((user) => user.get('title') || `${user.get('first_name', '')} ${user.get('last_name', '')}`);

  return {
    activeUserNames,
    me,
  };
};