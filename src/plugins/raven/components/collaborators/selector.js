import getCollaborators from 'plugins/raven/selectors/getCollaborators';

/**
 * @param {Object} state
 * @param {Object} ownProps
 *
 * @returns {Object}
 */
export default (state, { nodeRef }) => ({
  users: getCollaborators(state, nodeRef),
});