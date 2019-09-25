import GalleryV1Mixin from '@triniti/schemas/triniti/curator/mixin/gallery/GalleryV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import SearchGalleriesRequestV1Mixin from '@triniti/schemas/triniti/curator/mixin/search-galleries-request/SearchGalleriesRequestV1Mixin';

export default {
  node: GalleryV1Mixin.findOne(),
  nodeCreated: resolveSchema(GalleryV1Mixin, 'event', 'gallery-created'),
  createNode: resolveSchema(GalleryV1Mixin, 'command', 'create-gallery'),
  getNodeRequest: resolveSchema(GalleryV1Mixin, 'request', 'get-gallery-request'),
  searchNodes: SearchGalleriesRequestV1Mixin.findOne(),
};
