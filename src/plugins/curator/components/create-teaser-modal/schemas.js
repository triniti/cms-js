import TeaserV1Mixin from '@triniti/schemas/triniti/curator/mixin/teaser/TeaserV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import SearchTeasersRequestV1Mixin from '@triniti/schemas/triniti/curator/mixin/search-teasers-request/SearchTeasersRequestV1Mixin';

export default {
  nodes: TeaserV1Mixin.findAll(),
  nodeCreated: resolveSchema(TeaserV1Mixin, 'event', 'teaser-created'),
  createNode: resolveSchema(TeaserV1Mixin, 'command', 'create-teaser'),
  getNodeRequest: resolveSchema(TeaserV1Mixin, 'request', 'get-teaser-request'),
  searchNodes: SearchTeasersRequestV1Mixin.findOne(),
};
