import AppV1Mixin from '@gdbots/schemas/gdbots/iam/mixin/app/AppV1Mixin';
import GetAllAppsRequestV1Mixin from '@gdbots/schemas/gdbots/iam/mixin/get-all-apps-request/GetAllAppsRequestV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  nodes: AppV1Mixin.findAll(),
  nodeCreated: resolveSchema(AppV1Mixin, 'event', 'app-created'),
  createNode: resolveSchema(AppV1Mixin, 'command', 'create-app'),
  getNodeRequest: resolveSchema(AppV1Mixin, 'request', 'get-app-request'),
  searchNodes: GetAllAppsRequestV1Mixin.findOne(),
};
