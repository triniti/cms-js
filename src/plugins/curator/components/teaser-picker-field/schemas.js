import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import SearchTeasersRequestV1Mixin from '@triniti/schemas/triniti/curator/mixin/search-teasers-request/SearchTeasersRequestV1Mixin';
import SearchTeasersSort from '@triniti/schemas/triniti/curator/enums/SearchTeasersSort';

export default {
  searchNodes: SearchTeasersRequestV1Mixin.findOne(),
  searchNodesSort: SearchTeasersSort.RELEVANCE.getValue(),
  searchNodesStatus: NodeStatus.PUBLISHED.getValue(),
};
