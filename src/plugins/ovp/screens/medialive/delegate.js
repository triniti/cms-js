import searchNodes from '@triniti/cms/plugins/ncr/actions/searchNodes';
import SearchVideosRequestV1Mixin from '@triniti/schemas/triniti/ovp/mixin/search-videos-request/SearchVideosRequestV1Mixin';
import throttle from 'lodash/throttle';
import { pbjxChannelNames } from '../../constants';

export default (dispatch) => ({
  /**
   * @param {Object} data - pbj search request data except 'page'
   */
  handleSearch: throttle((data = {}) => {
    dispatch(searchNodes(SearchVideosRequestV1Mixin.findOne().createMessage({
      derefs: ['medialive_channel_status'],
      q: '_exists_:medialive_channel_arn',
    //   count: data.count || 50,
    //   page: 1,
    //   statuses: STATUSES,
    //   ...data,
    }), pbjxChannelNames.LIVESTREAM_VIDEO_SEARCH));
  }, 500),
});
