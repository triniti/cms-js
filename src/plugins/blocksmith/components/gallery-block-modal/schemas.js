import SearchGalleriesRequestV1Mixin from '@triniti/schemas/triniti/curator/mixin/search-galleries-request/SearchGalleriesRequestV1Mixin';
import SearchGalleriesSort from '@triniti/schemas/triniti/curator/enums/SearchGalleriesSort';
import SearchAssetsRequestV1Mixin from '@triniti/schemas/triniti/dam/mixin/search-assets-request/SearchAssetsRequestV1Mixin';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort';

export default {
  searchGalleries: SearchGalleriesRequestV1Mixin.findOne(),
  searchGalleriesSort: SearchGalleriesSort,
  searchAssets: SearchAssetsRequestV1Mixin.findOne(),
  searchAssetsSort: SearchAssetsSort,
};
