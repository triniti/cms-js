import TimelineV1Mixin from '@triniti/schemas/triniti/curator/mixin/timeline/TimelineV1Mixin';
import SearchTimelinesRequestV1Mixin from '@triniti/schemas/triniti/curator/mixin/search-timelines-request/SearchTimelinesRequestV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  deleteNode: resolveSchema(TimelineV1Mixin, 'command', 'delete-timeline'),
  getNodeHistoryRequest: resolveSchema(TimelineV1Mixin, 'request', 'get-timeline-history-request'),
  getNodeRequest: resolveSchema(TimelineV1Mixin, 'request', 'get-timeline-request'),
  markNodeAsDraft: resolveSchema(TimelineV1Mixin, 'command', 'mark-timeline-as-draft'),
  markNodeAsPending: resolveSchema(TimelineV1Mixin, 'command', 'mark-timeline-as-pending'),
  node: TimelineV1Mixin.findOne(),
  nodeDeleted: resolveSchema(TimelineV1Mixin, 'event', 'timeline-deleted'),
  nodeMarkedAsDraft: resolveSchema(TimelineV1Mixin, 'event', 'timeline-marked-as-draft'),
  nodeMarkedAsPending: resolveSchema(TimelineV1Mixin, 'event', 'timeline-marked-as-pending'),
  nodePublished: resolveSchema(TimelineV1Mixin, 'event', 'timeline-published'),
  nodeRenamed: resolveSchema(TimelineV1Mixin, 'event', 'timeline-renamed'),
  nodeScheduled: resolveSchema(TimelineV1Mixin, 'event', 'timeline-scheduled'),
  nodeUnpublished: resolveSchema(TimelineV1Mixin, 'event', 'timeline-unpublished'),
  nodeUpdated: resolveSchema(TimelineV1Mixin, 'event', 'timeline-updated'),
  publishNode: resolveSchema(TimelineV1Mixin, 'command', 'publish-timeline'),
  renameNode: resolveSchema(TimelineV1Mixin, 'command', 'rename-timeline'),
  searchNodes: SearchTimelinesRequestV1Mixin.findOne(),
  unpublishNode: resolveSchema(TimelineV1Mixin, 'command', 'unpublish-timeline'),
  updateNode: resolveSchema(TimelineV1Mixin, 'command', 'update-timeline'),
};
