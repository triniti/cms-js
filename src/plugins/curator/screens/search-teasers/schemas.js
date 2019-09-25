import SearchTeasersRequestV1Mixin
  from '@triniti/schemas/triniti/curator/mixin/search-teasers-request/SearchTeasersRequestV1Mixin';
import TeaserV1Mixin from '@triniti/schemas/triniti/curator/mixin/teaser/TeaserV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  deleteNode: resolveSchema(TeaserV1Mixin, 'command', 'delete-teaser'),
  getNodeRequest: resolveSchema(TeaserV1Mixin, 'request', 'get-teaser-request'),
  markNodeAsDraft: resolveSchema(TeaserV1Mixin, 'command', 'mark-teaser-as-draft'),
  nodeDeleted: resolveSchema(TeaserV1Mixin, 'event', 'teaser-deleted'),
  nodeMarkedAsDraft: resolveSchema(TeaserV1Mixin, 'event', 'teaser-marked-as-draft'),
  nodePublished: resolveSchema(TeaserV1Mixin, 'event', 'teaser-published'),
  nodes: TeaserV1Mixin.findAll(),
  publishNode: resolveSchema(TeaserV1Mixin, 'command', 'publish-teaser'),
  searchNodes: SearchTeasersRequestV1Mixin.findOne(),
};
