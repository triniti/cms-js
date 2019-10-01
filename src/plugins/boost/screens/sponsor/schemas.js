import SponsorV1Mixin from '@triniti/schemas/triniti/boost/mixin/sponsor/SponsorV1Mixin';
import SearchSponsorsRequestV1Mixin from '@triniti/schemas/triniti/boost/mixin/search-sponsors-request/SearchSponsorsRequestV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  deleteNode: resolveSchema(SponsorV1Mixin, 'command', 'delete-sponsor'),
  getNodeHistoryRequest: resolveSchema(SponsorV1Mixin, 'request', 'get-sponsor-history-request'),
  getNodeRequest: resolveSchema(SponsorV1Mixin, 'request', 'get-sponsor-request'),
  markNodeAsDraft: resolveSchema(SponsorV1Mixin, 'command', 'mark-sponsor-as-draft'),
  markNodeAsPending: resolveSchema(SponsorV1Mixin, 'command', 'mark-sponsor-as-pending'),
  nodeDeleted: resolveSchema(SponsorV1Mixin, 'event', 'sponsor-deleted'),
  nodeRenamed: resolveSchema(SponsorV1Mixin, 'event', 'sponsor-renamed'),
  nodeMarkedAsDraft: resolveSchema(SponsorV1Mixin, 'event', 'sponsor-marked-as-draft'),
  nodeMarkedAsPending: resolveSchema(SponsorV1Mixin, 'event', 'sponsor-marked-as-pending'),
  nodePublished: resolveSchema(SponsorV1Mixin, 'event', 'sponsor-published'),
  node: SponsorV1Mixin.findOne(),
  nodeScheduled: resolveSchema(SponsorV1Mixin, 'event', 'sponsor-scheduled'),
  nodeUnpublished: resolveSchema(SponsorV1Mixin, 'event', 'sponsor-unpublished'),
  nodeUpdated: resolveSchema(SponsorV1Mixin, 'event', 'sponsor-updated'),
  publishNode: resolveSchema(SponsorV1Mixin, 'command', 'publish-sponsor'),
  renameNode: resolveSchema(SponsorV1Mixin, 'command', 'rename-sponsor'),
  searchNodes: SearchSponsorsRequestV1Mixin.findOne(),
  unpublishNode: resolveSchema(SponsorV1Mixin, 'command', 'unpublish-sponsor'),
  updateNode: resolveSchema(SponsorV1Mixin, 'command', 'update-sponsor'),
};
