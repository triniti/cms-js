import SponsorV1Mixin from '@triniti/schemas/triniti/boost/mixin/sponsor/SponsorV1Mixin';
import SearchSponsorsRequestV1Mixin from '@triniti/schemas/triniti/boost/mixin/search-sponsors-request/SearchSponsorsRequestV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  node: SponsorV1Mixin.findOne(),
  nodeCreated: resolveSchema(SponsorV1Mixin, 'event', 'sponsor-created'),
  createNode: resolveSchema(SponsorV1Mixin, 'command', 'create-sponsor'),
  getNodeRequest: resolveSchema(SponsorV1Mixin, 'request', 'get-sponsor-request'),
  searchNodes: SearchSponsorsRequestV1Mixin.findOne(),
};
