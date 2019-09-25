import TimelineV1Mixin from '@triniti/schemas/triniti/curator/mixin/timeline/TimelineV1Mixin';
import SearchTimelinesRequestV1Mixin from '@triniti/schemas/triniti/curator/mixin/search-timelines-request/SearchTimelinesRequestV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  node: TimelineV1Mixin.findOne(),
  nodeCreated: resolveSchema(TimelineV1Mixin, 'event', 'timeline-created'),
  createNode: resolveSchema(TimelineV1Mixin, 'command', 'create-timeline'),
  getNodeRequest: resolveSchema(TimelineV1Mixin, 'request', 'get-timeline-request'),
  searchNodes: SearchTimelinesRequestV1Mixin.findOne(),
};
