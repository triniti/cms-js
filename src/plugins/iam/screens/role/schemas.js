import ListAllRolesRequestV1Mixin from '@gdbots/schemas/gdbots/iam/mixin/list-all-roles-request/ListAllRolesRequestV1Mixin';
import RoleV1Mixin from '@gdbots/schemas/gdbots/iam/mixin/role/RoleV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  deleteNode: resolveSchema(RoleV1Mixin, 'command', 'delete-role'),
  getNodeHistory: resolveSchema(RoleV1Mixin, 'request', 'get-role-history-request'),
  getNodeRequest: resolveSchema(RoleV1Mixin, 'request', 'get-role-request'),
  updateNode: resolveSchema(RoleV1Mixin, 'command', 'update-role'),
  node: RoleV1Mixin.findOne(),
  nodeDeleted: resolveSchema(RoleV1Mixin, 'event', 'role-deleted'),
  nodeUpdated: resolveSchema(RoleV1Mixin, 'event', 'role-updated'),
  searchNodes: ListAllRolesRequestV1Mixin.findOne(),
};
