import PollV1Mixin from '@triniti/schemas/triniti/apollo/mixin/poll/PollV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import SearchPollsRequestV1Mixin from '@triniti/schemas/triniti/apollo/mixin/search-polls-request/SearchPollsRequestV1Mixin';

export default {
  node: PollV1Mixin.findOne(),
  nodeCreated: resolveSchema(PollV1Mixin, 'event', 'poll-created'),
  createNode: resolveSchema(PollV1Mixin, 'command', 'create-poll'),
  getNodeRequest: resolveSchema(PollV1Mixin, 'request', 'get-poll-request'),
  searchNodes: SearchPollsRequestV1Mixin.findOne(),
};
