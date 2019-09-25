import WidgetV1Mixin from '@triniti/schemas/triniti/curator/mixin/widget/WidgetV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import SearchWidgetsRequestV1Mixin
  from '@triniti/schemas/triniti/curator/mixin/search-widgets-request/SearchWidgetsRequestV1Mixin';

export default {
  nodes: WidgetV1Mixin.findAll(),
  nodeCreated: resolveSchema(WidgetV1Mixin, 'event', 'widget-created'),
  createNode: resolveSchema(WidgetV1Mixin, 'command', 'create-widget'),
  getNodeRequest: resolveSchema(WidgetV1Mixin, 'request', 'get-widget-request'),
  searchNodes: SearchWidgetsRequestV1Mixin.findOne(),
};
