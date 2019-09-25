import SearchVideosRequestV1Mixin from '@triniti/schemas/triniti/ovp/mixin/search-videos-request/SearchVideosRequestV1Mixin';
import VideoV1Mixin from '@triniti/schemas/triniti/ovp/mixin/video/VideoV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  createNode: resolveSchema(VideoV1Mixin, 'command', 'create-video'),
  getNodeRequest: resolveSchema(VideoV1Mixin, 'request', 'get-video-request'),
  node: VideoV1Mixin.findOne(),
  nodeCreated: resolveSchema(VideoV1Mixin, 'event', 'video-created'),
  searchNodes: SearchVideosRequestV1Mixin.findOne(),
};
