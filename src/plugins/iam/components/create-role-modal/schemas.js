import ListAllRolesRequestV1Mixin from '@gdbots/schemas/gdbots/iam/mixin/list-all-roles-request/ListAllRolesRequestV1Mixin';
import RoleV1Mixin from '@gdbots/schemas/gdbots/iam/mixin/role/RoleV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  createNode: resolveSchema(RoleV1Mixin, 'command', 'create-role'),
  getNodeRequest: resolveSchema(RoleV1Mixin, 'request', 'get-role-request'),
  node: RoleV1Mixin.findOne(),
  nodeCreated: resolveSchema(RoleV1Mixin, 'event', 'role-created'),
  searchNodes: ListAllRolesRequestV1Mixin.findOne(),
};
