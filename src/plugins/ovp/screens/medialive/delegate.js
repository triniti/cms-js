import searchNodes from '@triniti/cms/plugins/ncr/actions/searchNodes';
import SearchVideosRequestV1Mixin from '@triniti/schemas/triniti/ovp/mixin/search-videos-request/SearchVideosRequestV1Mixin';
import { pbjxChannelNames } from '../../constants';

export default (dispatch) => ({
  handleSearch: () => dispatch(searchNodes(SearchVideosRequestV1Mixin.findOne().createMessage({
    derefs: ['medialive_channel_state'],
    q: '_exists_:medialive_channel_arn',
  }), pbjxChannelNames.LIVESTREAM_VIDEO_SEARCH)),
});
