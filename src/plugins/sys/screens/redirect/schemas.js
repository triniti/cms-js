import RedirectV1Mixin from '@triniti/schemas/triniti/sys/mixin/redirect/RedirectV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import SearchRedirectsRequestV1Mixin from '@triniti/schemas/triniti/sys/mixin/search-redirects-request/SearchRedirectsRequestV1Mixin';

export default {
  deleteNode: resolveSchema(RedirectV1Mixin, 'command', 'delete-redirect'),
  getNodeHistoryRequest: resolveSchema(RedirectV1Mixin, 'request', 'get-redirect-history-request'),
  getNodeRequest: resolveSchema(RedirectV1Mixin, 'request', 'get-redirect-request'),
  node: RedirectV1Mixin.findOne(),
  nodeDeleted: resolveSchema(RedirectV1Mixin, 'event', 'redirect-deleted'),
  nodeUpdated: resolveSchema(RedirectV1Mixin, 'event', 'redirect-updated'),
  searchNodes: SearchRedirectsRequestV1Mixin.findOne(),
  updateNode: resolveSchema(RedirectV1Mixin, 'command', 'update-redirect'),
};
