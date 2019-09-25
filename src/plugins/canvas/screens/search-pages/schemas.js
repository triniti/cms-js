import PageV1Mixin from '@triniti/schemas/triniti/canvas/mixin/page/PageV1Mixin';
import SearchPagesRequestV1Mixin from '@triniti/schemas/triniti/canvas/mixin/search-pages-request/SearchPagesRequestV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  deleteNode: resolveSchema(PageV1Mixin, 'command', 'delete-page'),
  getNodeRequest: resolveSchema(PageV1Mixin, 'request', 'get-page-request'),
  markNodeAsDraft: resolveSchema(PageV1Mixin, 'command', 'mark-page-as-draft'),
  nodeDeleted: resolveSchema(PageV1Mixin, 'event', 'page-deleted'),
  nodeMarkedAsDraft: resolveSchema(PageV1Mixin, 'event', 'page-marked-as-draft'),
  nodePublished: resolveSchema(PageV1Mixin, 'event', 'page-published'),
  publishNode: resolveSchema(PageV1Mixin, 'command', 'publish-page'),
  searchNodes: SearchPagesRequestV1Mixin.findOne(),
};
