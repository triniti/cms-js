import SearchVideosRequestV1Mixin from '@triniti/schemas/triniti/ovp/mixin/search-videos-request/SearchVideosRequestV1Mixin';
import SearchVideosSort from '@triniti/schemas/triniti/ovp/enums/SearchVideosSort';

export default {
  searchNodes: SearchVideosRequestV1Mixin.findOne(),
  searchNodesSort: SearchVideosSort,
};
