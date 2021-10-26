import SearchArticlesRequestV1Mixin from
'@triniti/schemas/triniti/news/mixin/search-articles-request/SearchArticlesRequestV1Mixin';
import SearchArticlesSort from '@triniti/schemas/triniti/news/enums/SearchArticlesSort';

export default {
  searchNodes: SearchArticlesRequestV1Mixin.findOne(),
  searchNodesSort: SearchArticlesSort.ORDER_DATE_DESC.getValue(),
};
