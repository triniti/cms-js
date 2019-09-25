import SearchPollsSort from '@triniti/schemas/triniti/apollo/enums/SearchPollsSort';
import SearchPollsRequestV1Mixin from
  '@triniti/schemas/triniti/apollo/mixin/search-polls-request/SearchPollsRequestV1Mixin';

export default {
  searchNodes: SearchPollsRequestV1Mixin.findOne(),
  searchNodeSort: SearchPollsSort,
};
