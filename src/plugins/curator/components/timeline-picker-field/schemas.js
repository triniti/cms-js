import SearchTimelinesRequestV1Mixin from '@triniti/schemas/triniti/curator/mixin/search-timelines-request/SearchTimelinesRequestV1Mixin';
import SearchTimelinesSort from '@triniti/schemas/triniti/curator/enums/SearchTimelinesSort';

export default {
  searchNodes: SearchTimelinesRequestV1Mixin.findOne(),
  searchNodesSort: SearchTimelinesSort.RELEVANCE.getValue(),
};
