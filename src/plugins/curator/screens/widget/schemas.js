import WidgetV1Mixin from '@triniti/schemas/triniti/curator/mixin/widget/WidgetV1Mixin';
import SearchWidgetsRequestV1Mixin from '@triniti/schemas/triniti/curator/mixin/search-widgets-request/SearchWidgetsRequestV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  deleteNode: resolveSchema(WidgetV1Mixin, 'command', 'delete-widget'),
  getNodeHistoryRequest: resolveSchema(WidgetV1Mixin, 'request', 'get-widget-history-request'),
  getNodeRequest: resolveSchema(WidgetV1Mixin, 'request', 'get-widget-request'),
  nodeDeleted: resolveSchema(WidgetV1Mixin, 'event', 'widget-deleted'),
  nodes: WidgetV1Mixin.findAll(),
  nodeUpdated: resolveSchema(WidgetV1Mixin, 'event', 'widget-updated'),
  searchNodes: SearchWidgetsRequestV1Mixin.findOne(),
  updateNode: resolveSchema(WidgetV1Mixin, 'command', 'update-widget'),
};
