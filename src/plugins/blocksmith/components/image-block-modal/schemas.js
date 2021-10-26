import SearchAssetsRequestV1Mixin from '@triniti/schemas/triniti/dam/mixin/search-assets-request/SearchAssetsRequestV1Mixin';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort';

export default {
  searchNodes: SearchAssetsRequestV1Mixin.findOne(),
  searchNodesSort: SearchAssetsSort,
};
