import SearchRedirectSort from '@triniti/schemas/triniti/sys/enums/SearchRedirectsSort';
import SearchRedirectsRequestV1Mixin from '@triniti/schemas/triniti/sys/mixin/search-redirects-request/SearchRedirectsRequestV1Mixin';

export default {
  searchNodes: SearchRedirectsRequestV1Mixin.findOne(),
  searchNodeSort: SearchRedirectSort.TITLE_ASC.getValue(),
};
