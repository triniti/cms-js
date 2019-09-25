import throttle from 'lodash/throttle';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import searchNodes from '@triniti/cms/plugins/ncr/actions/searchNodes';
import clearChannel from '@triniti/cms/plugins/pbjx/actions/clearChannel';
import schemas from './schemas';
import { pbjxChannelNames } from '../../constants';

const STATUSES = [NodeStatus.PUBLISHED.getValue(), NodeStatus.SCHEDULED.getValue()];

export default (dispatch) => ({
  handleClearAudioAssetChannel: () => {
    dispatch(clearChannel(pbjxChannelNames.AUDIO_ASSET_SEARCH));
  },

  /**
   * @param {Object} data - pbj search request data except 'page'
   */
  handleSearchAudioAssets: throttle((data = {}) => {
    dispatch(searchNodes(schemas.searchAssets.createMessage({
      count: 50,
      page: 1,
      statuses: STATUSES,
      types: ['audio-asset'],
      ...data,
    }), pbjxChannelNames.AUDIO_ASSET_SEARCH));
  }, 500),
});
