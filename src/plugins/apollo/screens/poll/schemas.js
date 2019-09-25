import PollV1Mixin from '@triniti/schemas/triniti/apollo/mixin/poll/PollV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import SearchPollsRequestV1Mixin from '@triniti/schemas/triniti/apollo/mixin/search-polls-request/SearchPollsRequestV1Mixin';

export default {
  deleteNode: resolveSchema(PollV1Mixin, 'command', 'delete-poll'),
  getNodeHistoryRequest: resolveSchema(PollV1Mixin, 'request', 'get-poll-history-request'),
  getNodeRequest: resolveSchema(PollV1Mixin, 'request', 'get-poll-request'),
  markNodeAsDraft: resolveSchema(PollV1Mixin, 'command', 'mark-poll-as-draft'),
  markNodeAsPending: resolveSchema(PollV1Mixin, 'command', 'mark-poll-as-pending'),
  node: PollV1Mixin.findOne(),
  nodeDeleted: resolveSchema(PollV1Mixin, 'event', 'poll-deleted'),
  nodeMarkedAsDraft: resolveSchema(PollV1Mixin, 'event', 'poll-marked-as-draft'),
  nodeMarkedAsPending: resolveSchema(PollV1Mixin, 'event', 'poll-marked-as-pending'),
  nodePublished: resolveSchema(PollV1Mixin, 'event', 'poll-published'),
  nodeScheduled: resolveSchema(PollV1Mixin, 'event', 'poll-scheduled'),
  nodeUpdated: resolveSchema(PollV1Mixin, 'event', 'poll-updated'),
  nodeUnpublished: resolveSchema(PollV1Mixin, 'event', 'poll-unpublished'),
  publishNode: resolveSchema(PollV1Mixin, 'command', 'publish-poll'),
  searchNodes: SearchPollsRequestV1Mixin.findOne(),
  unpublishNode: resolveSchema(PollV1Mixin, 'command', 'unpublish-poll'),
  updateNode: resolveSchema(PollV1Mixin, 'command', 'update-poll'),
};
