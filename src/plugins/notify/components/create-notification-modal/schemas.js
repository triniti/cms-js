import GetAllAppsRequestV1Mixin from '@gdbots/schemas/gdbots/iam/mixin/get-all-apps-request/GetAllAppsRequestV1Mixin';
import NotificationV1Mixin from '@triniti/schemas/triniti/notify/mixin/notification/NotificationV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import SearchNotificationsRequestV1Mixin from '@triniti/schemas/triniti/notify/mixin/search-notifications-request/SearchNotificationsRequestV1Mixin';

export default {
  nodes: NotificationV1Mixin.findAll(),
  nodeCreated: resolveSchema(NotificationV1Mixin, 'event', 'notification-created'),
  createNode: resolveSchema(NotificationV1Mixin, 'command', 'create-notification'),
  getAllApps: GetAllAppsRequestV1Mixin.findOne(),
  getNodeRequest: resolveSchema(NotificationV1Mixin, 'request', 'get-notification-request'),
  searchNodes: SearchNotificationsRequestV1Mixin.findOne(),
};
