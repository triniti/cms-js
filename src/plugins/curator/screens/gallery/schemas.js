import GalleryV1Mixin from '@triniti/schemas/triniti/curator/mixin/gallery/GalleryV1Mixin';
import SearchGalleriesRequestV1Mixin from '@triniti/schemas/triniti/curator/mixin/search-galleries-request/SearchGalleriesRequestV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  node: GalleryV1Mixin.findOne(),
  nodeDeleted: resolveSchema(GalleryV1Mixin, 'event', 'gallery-deleted'),
  nodeUpdated: resolveSchema(GalleryV1Mixin, 'event', 'gallery-updated'),
  nodeRenamed: resolveSchema(GalleryV1Mixin, 'event', 'gallery-renamed'),
  deleteNode: resolveSchema(GalleryV1Mixin, 'command', 'delete-gallery'),
  getNodeHistoryRequest: resolveSchema(GalleryV1Mixin, 'request', 'get-gallery-history-request'),
  getNodeRequest: resolveSchema(GalleryV1Mixin, 'request', 'get-gallery-request'),
  markNodeAsDraft: resolveSchema(GalleryV1Mixin, 'command', 'mark-gallery-as-draft'),
  markNodeAsPending: resolveSchema(GalleryV1Mixin, 'command', 'mark-gallery-as-pending'),
  nodePublished: resolveSchema(GalleryV1Mixin, 'event', 'gallery-published'),
  nodeScheduled: resolveSchema(GalleryV1Mixin, 'event', 'gallery-scheduled'),
  nodeUnpublished: resolveSchema(GalleryV1Mixin, 'event', 'gallery-unpublished'),
  nodeMarkedAsDraft: resolveSchema(GalleryV1Mixin, 'event', 'gallery-marked-as-draft'),
  nodeMarkedAsPending: resolveSchema(GalleryV1Mixin, 'event', 'gallery-marked-as-pending'),
  publishNode: resolveSchema(GalleryV1Mixin, 'command', 'publish-gallery'),
  renameNode: resolveSchema(GalleryV1Mixin, 'command', 'rename-gallery'),
  searchNodes: SearchGalleriesRequestV1Mixin.findOne(),
  unpublishNode: resolveSchema(GalleryV1Mixin, 'command', 'unpublish-gallery'),
  updateNode: resolveSchema(GalleryV1Mixin, 'command', 'update-gallery'),
};
