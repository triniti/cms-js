import SearchSponsorsRequestV1Mixin from '@triniti/schemas/triniti/boost/mixin/search-sponsors-request/SearchSponsorsRequestV1Mixin';
import SearchSponsorsSort from '@triniti/schemas/triniti/boost/enums/SearchSponsorsSort';

export default {
  searchNodes: SearchSponsorsRequestV1Mixin.findOne(),
  searchNodesSort: SearchSponsorsSort.RELEVANCE.getValue(),
};
