import SearchVideosRequestV1Mixin from '@triniti/schemas/triniti/ovp/mixin/search-videos-request/SearchVideosRequestV1Mixin';
import VideoV1Mixin from '@triniti/schemas/triniti/ovp/mixin/video/VideoV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  deleteNode: resolveSchema(VideoV1Mixin, 'command', 'delete-video'),
  getNodeHistoryRequest: resolveSchema(VideoV1Mixin, 'request', 'get-video-history-request'),
  getNodeRequest: resolveSchema(VideoV1Mixin, 'request', 'get-video-request'),
  markNodeAsDraft: resolveSchema(VideoV1Mixin, 'command', 'mark-video-as-draft'),
  markNodeAsPending: resolveSchema(VideoV1Mixin, 'command', 'mark-video-as-pending'),
  node: VideoV1Mixin.findOne(),
  nodeDeleted: resolveSchema(VideoV1Mixin, 'event', 'video-deleted'),
  nodeRenamed: resolveSchema(VideoV1Mixin, 'event', 'video-renamed'),
  nodeUpdated: resolveSchema(VideoV1Mixin, 'event', 'video-updated'),
  nodePublished: resolveSchema(VideoV1Mixin, 'event', 'video-published'),
  nodeScheduled: resolveSchema(VideoV1Mixin, 'event', 'video-scheduled'),
  nodeUnpublished: resolveSchema(VideoV1Mixin, 'event', 'video-unpublished'),
  nodeMarkedAsDraft: resolveSchema(VideoV1Mixin, 'event', 'video-marked-as-draft'),
  nodeMarkedAsPending: resolveSchema(VideoV1Mixin, 'event', 'video-marked-as-pending'),
  publishNode: resolveSchema(VideoV1Mixin, 'command', 'publish-video'),
  renameNode: resolveSchema(VideoV1Mixin, 'command', 'rename-video'),
  searchNodes: SearchVideosRequestV1Mixin.findOne(),
  unpublishNode: resolveSchema(VideoV1Mixin, 'command', 'unpublish-video'),
  updateNode: resolveSchema(VideoV1Mixin, 'command', 'update-video'),
};
