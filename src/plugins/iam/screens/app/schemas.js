import AppV1Mixin from '@gdbots/schemas/gdbots/iam/mixin/app/AppV1Mixin';
import GetAllAppsRequestV1Mixin from '@gdbots/schemas/gdbots/iam/mixin/get-all-apps-request/GetAllAppsRequestV1Mixin';
import GrantRolesToAppMixin from '@gdbots/schemas/gdbots/iam/mixin/grant-roles-to-app/GrantRolesToAppV1Mixin';
import RevokeRolesFromAppMixin from '@gdbots/schemas/gdbots/iam/mixin/revoke-roles-from-app/RevokeRolesFromAppV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  deleteNode: resolveSchema(AppV1Mixin, 'command', 'delete-app'),
  getNodeHistoryRequest: resolveSchema(AppV1Mixin, 'request', 'get-app-history-request'),
  getNodeRequest: resolveSchema(AppV1Mixin, 'request', 'get-app-request'),
  nodeDeleted: resolveSchema(AppV1Mixin, 'event', 'app-deleted'),
  nodes: AppV1Mixin.findAll(),
  nodeUpdated: resolveSchema(AppV1Mixin, 'event', 'app-updated'),
  updateNode: resolveSchema(AppV1Mixin, 'command', 'update-app'),
  grantRolesToNode: GrantRolesToAppMixin.findOne(),
  revokeRolesFromNode: RevokeRolesFromAppMixin.findOne(),
  searchNodes: GetAllAppsRequestV1Mixin.findOne(),
};
