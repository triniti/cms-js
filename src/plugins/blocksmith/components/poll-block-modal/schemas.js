import SearchPollsRequestV1Mixin from '@triniti/schemas/triniti/apollo/mixin/search-polls-request/SearchPollsRequestV1Mixin';
import SearchPollsSort from '@triniti/schemas/triniti/apollo/enums/SearchPollsSort';

export default {
  searchNodes: SearchPollsRequestV1Mixin.findOne(),
  searchNodesSort: SearchPollsSort,
};
