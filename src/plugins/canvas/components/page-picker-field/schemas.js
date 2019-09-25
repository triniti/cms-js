import SearchPagesRequestV1Mixin from '@triniti/schemas/triniti/canvas/mixin/search-pages-request/SearchPagesRequestV1Mixin';
import SearchPagesSort from '@triniti/schemas/triniti/canvas/enums/SearchPagesSort';

export default {
  searchNodes: SearchPagesRequestV1Mixin.findOne(),
  searchNodesSort: SearchPagesSort.RELEVANCE.getValue(),
};
