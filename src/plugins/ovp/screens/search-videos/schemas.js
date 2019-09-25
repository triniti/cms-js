import SearchVideosRequestV1Mixin from '@triniti/schemas/triniti/ovp/mixin/search-videos-request/SearchVideosRequestV1Mixin';
import VideoV1Mixin from '@triniti/schemas/triniti/ovp/mixin/video/VideoV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  deleteNode: resolveSchema(VideoV1Mixin, 'command', 'delete-video'),
  getNodeRequest: resolveSchema(VideoV1Mixin, 'request', 'get-video-request'),
  markNodeAsDraft: resolveSchema(VideoV1Mixin, 'command', 'mark-video-as-draft'),
  nodeDeleted: resolveSchema(VideoV1Mixin, 'event', 'video-deleted'),
  nodeMarkedAsDraft: resolveSchema(VideoV1Mixin, 'event', 'video-marked-as-draft'),
  nodePublished: resolveSchema(VideoV1Mixin, 'event', 'video-published'),
  publishNode: resolveSchema(VideoV1Mixin, 'command', 'publish-video'),
  searchNodes: SearchVideosRequestV1Mixin.findOne(),
};
