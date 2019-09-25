import SearchTimelinesRequestV1Mixin from '@triniti/schemas/triniti/curator/mixin/search-timelines-request/SearchTimelinesRequestV1Mixin';
import TimelineV1Mixin from '@triniti/schemas/triniti/curator/mixin/timeline/TimelineV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  deleteNode: resolveSchema(TimelineV1Mixin, 'command', 'delete-timeline'),
  getNodeRequest: resolveSchema(TimelineV1Mixin, 'request', 'get-timeline-request'),
  markNodeAsDraft: resolveSchema(TimelineV1Mixin, 'command', 'mark-timeline-as-draft'),
  nodeDeleted: resolveSchema(TimelineV1Mixin, 'event', 'timeline-deleted'),
  nodeMarkedAsDraft: resolveSchema(TimelineV1Mixin, 'event', 'timeline-marked-as-draft'),
  nodePublished: resolveSchema(TimelineV1Mixin, 'event', 'timeline-published'),
  publishNode: resolveSchema(TimelineV1Mixin, 'command', 'publish-timeline'),
  searchNodes: SearchTimelinesRequestV1Mixin.findOne(),
};
