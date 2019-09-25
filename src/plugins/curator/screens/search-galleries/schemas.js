import SearchGalleriesRequestV1Mixin from '@triniti/schemas/triniti/curator/mixin/search-galleries-request/SearchGalleriesRequestV1Mixin';
import GalleryV1Mixin from '@triniti/schemas/triniti/curator/mixin/gallery/GalleryV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  deleteNode: resolveSchema(GalleryV1Mixin, 'command', 'delete-gallery'),
  getNodeRequest: resolveSchema(GalleryV1Mixin, 'request', 'get-gallery-request'),
  markNodeAsDraft: resolveSchema(GalleryV1Mixin, 'command', 'mark-gallery-as-draft'),
  nodeDeleted: resolveSchema(GalleryV1Mixin, 'event', 'gallery-deleted'),
  nodeMarkedAsDraft: resolveSchema(GalleryV1Mixin, 'event', 'gallery-marked-as-draft'),
  nodePublished: resolveSchema(GalleryV1Mixin, 'event', 'gallery-published'),
  publishNode: resolveSchema(GalleryV1Mixin, 'command', 'publish-gallery'),
  searchNodes: SearchGalleriesRequestV1Mixin.findOne(),
};
