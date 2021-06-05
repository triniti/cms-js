import GalleryV1Mixin from '@triniti/schemas/triniti/curator/mixin/gallery/GalleryV1Mixin';
import ImageAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/image-asset/ImageAssetV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  getGalleryNodeRequest: resolveSchema(GalleryV1Mixin, 'request', 'get-gallery-request'),
  getImageNodeRequest: resolveSchema(ImageAssetV1Mixin, 'request', 'get-asset-request'),
};
