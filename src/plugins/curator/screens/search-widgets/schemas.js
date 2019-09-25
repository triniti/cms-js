import SearchWidgetsRequestV1Mixin from '@triniti/schemas/triniti/curator/mixin/search-widgets-request/SearchWidgetsRequestV1Mixin';
import WidgetV1Mixin from '@triniti/schemas/triniti/curator/mixin/widget/WidgetV1Mixin';

export default {
  nodes: WidgetV1Mixin.findAll(),
  searchNodes: SearchWidgetsRequestV1Mixin.findOne(),
};
