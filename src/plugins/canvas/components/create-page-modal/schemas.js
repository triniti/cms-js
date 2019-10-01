import PageV1Mixin from '@triniti/schemas/triniti/canvas/mixin/page/PageV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import SearchPagesRequestV1Mixin from '@triniti/schemas/triniti/canvas/mixin/search-pages-request/SearchPagesRequestV1Mixin';

export default {
  createNode: resolveSchema(PageV1Mixin, 'command', 'create-page'),
  getNodeRequest: resolveSchema(PageV1Mixin, 'request', 'get-page-request'),
  node: PageV1Mixin.findOne(),
  nodeCreated: resolveSchema(PageV1Mixin, 'event', 'page-created'),
  searchNodes: SearchPagesRequestV1Mixin.findOne(),
};
