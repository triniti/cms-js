import { throttle } from 'lodash-es';
import clearChannel from '@triniti/cms/plugins/pbjx/actions/clearChannel';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort';
import searchNodes from '@triniti/cms/plugins/ncr/actions/searchNodes';
import VideoAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/video-asset/VideoAssetV1Mixin';
import { pbjxChannelNames } from './constants';
import schemas from './schemas';

const STATUSES = [NodeStatus.PUBLISHED.getValue()];
const videoType = VideoAssetV1Mixin.findOne().getCurie().getMessage();

export default (dispatch) => ({
  /**
   * @param {Object} data - pbj search request data except 'page'
   * @param {number} page - paginated page number
   */
  handleSearch: throttle((data = {}, page = 1) => {
    const requestData = {
      count: 150,
      sort: SearchAssetsSort.CREATED_AT_DESC.getValue(),
      statuses: STATUSES,
      page,
      types: [videoType],
      ...data,
    };

    const request = schemas.searchNodes.createMessage(requestData);
    dispatch(searchNodes(request, pbjxChannelNames.VIDEO_ASSET_SEARCH));
  }, 500),

  handleClearChannel: () => dispatch(clearChannel(pbjxChannelNames.VIDEO_ASSET_SEARCH)),
});
