import RedirectV1Mixin from '@triniti/schemas/triniti/sys/mixin/redirect/RedirectV1Mixin';
import SearchRedirectsRequestV1Mixin from '@triniti/schemas/triniti/sys/mixin/search-redirects-request/SearchRedirectsRequestV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  createNode: resolveSchema(RedirectV1Mixin, 'command', 'create-redirect'),
  getNodeRequest: resolveSchema(RedirectV1Mixin, 'request', 'get-redirect-request'),
  node: RedirectV1Mixin.findOne(),
  nodeCreated: resolveSchema(RedirectV1Mixin, 'event', 'redirect-created'),
  searchNodes: SearchRedirectsRequestV1Mixin.findOne(),
};
