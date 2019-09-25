import SearchGalleriesRequestV1Mixin from '@triniti/schemas/triniti/curator/mixin/search-galleries-request/SearchGalleriesRequestV1Mixin';
import SearchGalleriesSort from '@triniti/schemas/triniti/curator/enums/SearchGalleriesSort';

export default {
  searchNodes: SearchGalleriesRequestV1Mixin.findOne(),
  searchNodesSort: SearchGalleriesSort.ORDER_DATE_DESC.getValue(),
};
