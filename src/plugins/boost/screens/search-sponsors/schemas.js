import SearchSponsorsRequestV1Mixin from '@triniti/schemas/triniti/boost/mixin/search-sponsors-request/SearchSponsorsRequestV1Mixin';
import SponsorV1Mixin from '@triniti/schemas/triniti/boost/mixin/sponsor/SponsorV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  deleteNode: resolveSchema(SponsorV1Mixin, 'command', 'delete-sponsor'),
  getNodeRequest: resolveSchema(SponsorV1Mixin, 'request', 'get-sponsor-request'),
  markNodeAsDraft: resolveSchema(SponsorV1Mixin, 'command', 'mark-sponsor-as-draft'),
  nodeDeleted: resolveSchema(SponsorV1Mixin, 'event', 'sponsor-deleted'),
  nodeMarkedAsDraft: resolveSchema(SponsorV1Mixin, 'event', 'sponsor-marked-as-draft'),
  nodePublished: resolveSchema(SponsorV1Mixin, 'event', 'sponsor-published'),
  publishNode: resolveSchema(SponsorV1Mixin, 'command', 'publish-sponsor'),
  searchNodes: SearchSponsorsRequestV1Mixin.findOne(),
};
