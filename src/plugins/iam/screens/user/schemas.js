import GrantRolesToUserMixin from '@gdbots/schemas/gdbots/iam/mixin/grant-roles-to-user/GrantRolesToUserV1Mixin';
import RevokeRolesFromUserMixin from '@gdbots/schemas/gdbots/iam/mixin/revoke-roles-from-user/RevokeRolesFromUserV1Mixin';
import SearchUsersRequestV1Mixin from '@gdbots/schemas/gdbots/iam/mixin/search-users-request/SearchUsersRequestV1Mixin';
import UserV1Mixin from '@gdbots/schemas/gdbots/iam/mixin/user/UserV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  deleteNode: resolveSchema(UserV1Mixin, 'command', 'delete-user'),
  getNodeHistory: resolveSchema(UserV1Mixin, 'request', 'get-user-history-request'),
  getNodeRequest: resolveSchema(UserV1Mixin, 'request', 'get-user-request'),
  updateNode: resolveSchema(UserV1Mixin, 'command', 'update-user'),
  node: UserV1Mixin.findOne(),
  nodeDeleted: resolveSchema(UserV1Mixin, 'event', 'user-deleted'),
  nodeUpdated: resolveSchema(UserV1Mixin, 'event', 'user-updated'),
  grantRolesToNode: GrantRolesToUserMixin.findOne(),
  revokeRolesFromNode: RevokeRolesFromUserMixin.findOne(),
  searchNodes: SearchUsersRequestV1Mixin.findOne(),
};
