import GetAllAppsRequestV1Mixin from '@gdbots/schemas/gdbots/iam/mixin/get-all-apps-request/GetAllAppsRequestV1Mixin';
import SearchNotificationsRequestV1Mixin from '@triniti/schemas/triniti/notify/mixin/search-notifications-request/SearchNotificationsRequestV1Mixin';

export default {
  getAllApps: GetAllAppsRequestV1Mixin.findOne(),
  searchNodes: SearchNotificationsRequestV1Mixin.findOne(),
};
