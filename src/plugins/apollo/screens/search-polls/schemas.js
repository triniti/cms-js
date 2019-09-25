import PollV1Mixin from '@triniti/schemas/triniti/apollo/mixin/poll/PollV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import SearchPollsRequestV1Mixin from '@triniti/schemas/triniti/apollo/mixin/search-polls-request/SearchPollsRequestV1Mixin';

export default {
  deleteNode: resolveSchema(PollV1Mixin, 'command', 'delete-poll'),
  getNodeRequest: resolveSchema(PollV1Mixin, 'request', 'get-poll-request'),
  nodeDeleted: resolveSchema(PollV1Mixin, 'event', 'poll-deleted'),
  nodeMarkedAsDraft: resolveSchema(PollV1Mixin, 'event', 'poll-marked-as-draft'),
  nodePublished: resolveSchema(PollV1Mixin, 'event', 'poll-published'),
  markNodeAsDraft: resolveSchema(PollV1Mixin, 'command', 'mark-poll-as-draft'),
  publishNode: resolveSchema(PollV1Mixin, 'command', 'publish-poll'),
  searchNodes: SearchPollsRequestV1Mixin.findOne(),
};
