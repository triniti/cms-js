import SearchNotificationsRequestV1Mixin
from '@triniti/schemas/triniti/notify/mixin/search-notifications-request/SearchNotificationsRequestV1Mixin';
import SearchNotificationsSort from '@triniti/schemas/triniti/notify/enums/SearchNotificationsSort';

export default {
  searchNodes: SearchNotificationsRequestV1Mixin.findOne(),
  searchNodesSort: SearchNotificationsSort,
};
