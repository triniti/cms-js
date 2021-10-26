import NotificationV1Mixin
from '@triniti/schemas/triniti/notify/mixin/notification/NotificationV1Mixin';
import SearchNotificationsRequestV1Mixin
from '@triniti/schemas/triniti/notify/mixin/search-notifications-request/SearchNotificationsRequestV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  deleteNode: resolveSchema(NotificationV1Mixin, 'command', 'delete-notification'),
  getNodeHistoryRequest: resolveSchema(NotificationV1Mixin, 'request', 'get-notification-history-request'),
  getNodeRequest: resolveSchema(NotificationV1Mixin, 'request', 'get-notification-request'),
  nodeDeleted: resolveSchema(NotificationV1Mixin, 'event', 'notification-deleted'),
  nodes: NotificationV1Mixin.findAll(),
  nodeUpdated: resolveSchema(NotificationV1Mixin, 'event', 'notification-updated'),
  searchNodes: SearchNotificationsRequestV1Mixin.findOne(),
  updateNode: resolveSchema(NotificationV1Mixin, 'command', 'update-notification'),
};
