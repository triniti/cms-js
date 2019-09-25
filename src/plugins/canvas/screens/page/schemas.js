import PageV1Mixin from '@triniti/schemas/triniti/canvas/mixin/page/PageV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import SearchPagesRequestV1Mixin from '@triniti/schemas/triniti/canvas/mixin/search-pages-request/SearchPagesRequestV1Mixin';

export default {
  deleteNode: resolveSchema(PageV1Mixin, 'command', 'delete-page'),
  getNodeHistoryRequest: resolveSchema(PageV1Mixin, 'request', 'get-page-history-request'),
  getNodeRequest: resolveSchema(PageV1Mixin, 'request', 'get-page-request'),
  markNodeAsDraft: resolveSchema(PageV1Mixin, 'command', 'mark-page-as-draft'),
  markNodeAsPending: resolveSchema(PageV1Mixin, 'command', 'mark-page-as-pending'),
  node: PageV1Mixin.findOne(),
  nodeDeleted: resolveSchema(PageV1Mixin, 'event', 'page-deleted'),
  nodeRenamed: resolveSchema(PageV1Mixin, 'event', 'page-renamed'),
  nodeUpdated: resolveSchema(PageV1Mixin, 'event', 'page-updated'),
  nodePublished: resolveSchema(PageV1Mixin, 'event', 'page-published'),
  nodeScheduled: resolveSchema(PageV1Mixin, 'event', 'page-scheduled'),
  nodeUnpublished: resolveSchema(PageV1Mixin, 'event', 'page-unpublished'),
  nodeMarkedAsDraft: resolveSchema(PageV1Mixin, 'event', 'page-marked-as-draft'),
  nodeMarkedAsPending: resolveSchema(PageV1Mixin, 'event', 'page-marked-as-pending'),
  publishNode: resolveSchema(PageV1Mixin, 'command', 'publish-page'),
  renameNode: resolveSchema(PageV1Mixin, 'command', 'rename-page'),
  searchNodes: SearchPagesRequestV1Mixin.findOne(),
  unpublishNode: resolveSchema(PageV1Mixin, 'command', 'unpublish-page'),
  updateNode: resolveSchema(PageV1Mixin, 'command', 'update-page'),
};
