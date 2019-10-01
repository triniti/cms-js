import RedirectV1Mixin from '@triniti/schemas/triniti/sys/mixin/redirect/RedirectV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import SearchRedirectsRequestV1Mixin from '@triniti/schemas/triniti/sys/mixin/search-redirects-request/SearchRedirectsRequestV1Mixin';

export default {
  deleteNode: resolveSchema(RedirectV1Mixin, 'command', 'delete-redirect'),
  getNodeRequest: resolveSchema(RedirectV1Mixin, 'request', 'get-redirect-request'),
  nodeDeleted: resolveSchema(RedirectV1Mixin, 'event', 'redirect-deleted'),
  searchNodes: SearchRedirectsRequestV1Mixin.findOne(),
};
