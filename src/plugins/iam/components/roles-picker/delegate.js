import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import sendAlert from '@triniti/admin-ui-plugin/actions/sendAlert';
import ownSchemas from './schemas';

export default (dispatch, { schemas }) => ({
  /**
   * Initialize the component with all roles list
   */
  handleInitialize: () => dispatch(ownSchemas.listAllRolesRequest.createMessage()),

  /**
   * Send a notification alert
   * @param {string} message
   * @param {string} type - bootstrap color type.
   */
  sendAlert: (message, type = 'success') => {
    dispatch(sendAlert({
      type,
      isDismissible: true,
      delay: 5000,
      message,
    }));
  },

  /**
   * @param {Message} node
   * @param {Array} rolesToBeGranted - a set of roles' node ref
   *
   * @return {Promise}
   */
  grantRolesToNode: (node, rolesToBeGranted) => (
    dispatch(schemas.grantRolesToNode
      .createMessage()
      .set('node_ref', NodeRef.fromNode(node))
      .addToSet('roles', rolesToBeGranted.map((role) => NodeRef.fromString(role))))
  ),

  /**
   * @param {Message} node
   * @param {Array} rolesToBeRevoked - a set of roles' node ref
   *
   * @return {Promise}
   */
  revokeRolesFromNode: (node, rolesToBeRevoked) => (
    dispatch(schemas.revokeRolesFromNode
      .createMessage()
      .set('node_ref', NodeRef.fromNode(node))
      .addToSet('roles', rolesToBeRevoked.map((role) => NodeRef.fromString(role))))
  ),

  /**
   * This function filters the roles that current user has already had
   *
   * @param {Message} response - all roles response
   * @param {Message} node
   *
   * @return {Array}
   */
  findRolesToDisplay: (response, node) => {
    const allRoles = response.get('roles');

    if (!node.has('roles')) {
      return allRoles;
    }

    return allRoles.filter((role) => !node.isInSet('roles', role));
  },
});
