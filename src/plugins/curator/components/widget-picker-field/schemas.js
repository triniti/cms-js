import SearchWidgetsRequestV1Mixin from '@triniti/schemas/triniti/curator/mixin/search-widgets-request/SearchWidgetsRequestV1Mixin';
import SearchWidgetsSort from '@triniti/schemas/triniti/curator/enums/SearchWidgetsSort';

export default {
  searchNodes: SearchWidgetsRequestV1Mixin.findOne(),
  searchNodesSort: SearchWidgetsSort.RELEVANCE.getValue(),
};
