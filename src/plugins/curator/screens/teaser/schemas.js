import TeaserV1Mixin from '@triniti/schemas/triniti/curator/mixin/teaser/TeaserV1Mixin';
import SearchTeasersRequestV1Mixin from '@triniti/schemas/triniti/curator/mixin/search-teasers-request/SearchTeasersRequestV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  deleteNode: resolveSchema(TeaserV1Mixin, 'command', 'delete-teaser'),
  getNodeHistoryRequest: resolveSchema(TeaserV1Mixin, 'request', 'get-teaser-history-request'),
  getNodeRequest: resolveSchema(TeaserV1Mixin, 'request', 'get-teaser-request'),
  markNodeAsDraft: resolveSchema(TeaserV1Mixin, 'command', 'mark-teaser-as-draft'),
  markNodeAsPending: resolveSchema(TeaserV1Mixin, 'command', 'mark-teaser-as-pending'),
  nodeDeleted: resolveSchema(TeaserV1Mixin, 'event', 'teaser-deleted'),
  nodeMarkedAsDraft: resolveSchema(TeaserV1Mixin, 'event', 'teaser-marked-as-draft'),
  nodeMarkedAsPending: resolveSchema(TeaserV1Mixin, 'event', 'teaser-marked-as-pending'),
  nodePublished: resolveSchema(TeaserV1Mixin, 'event', 'teaser-published'),
  nodes: TeaserV1Mixin.findAll(),
  nodeScheduled: resolveSchema(TeaserV1Mixin, 'event', 'teaser-scheduled'),
  nodeUnpublished: resolveSchema(TeaserV1Mixin, 'event', 'teaser-unpublished'),
  nodeUpdated: resolveSchema(TeaserV1Mixin, 'event', 'teaser-updated'),
  publishNode: resolveSchema(TeaserV1Mixin, 'command', 'publish-teaser'),
  searchNodes: SearchTeasersRequestV1Mixin.findOne(),
  unpublishNode: resolveSchema(TeaserV1Mixin, 'command', 'unpublish-teaser'),
  updateNode: resolveSchema(TeaserV1Mixin, 'command', 'update-teaser'),
};
