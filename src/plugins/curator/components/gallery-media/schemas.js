import GalleryAssetReorderedV1Mixin from '@triniti/schemas/triniti/dam/mixin/gallery-asset-reordered/GalleryAssetReorderedV1Mixin';
import ReorderGalleryAssetsV1Mixin from '@triniti/schemas/triniti/dam/mixin/reorder-gallery-assets/ReorderGalleryAssetsV1Mixin';
import SearchAssetsRequestV1Mixin from '@triniti/schemas/triniti/dam/mixin/search-assets-request/SearchAssetsRequestV1Mixin';

export default {
  galleryAssetReordered: GalleryAssetReorderedV1Mixin.findOne(),
  reorderGalleryAssets: ReorderGalleryAssetsV1Mixin.findOne(),
  searchNodesRequest: SearchAssetsRequestV1Mixin.findOne(),
};
