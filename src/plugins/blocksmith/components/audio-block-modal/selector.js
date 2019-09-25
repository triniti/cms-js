import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';
import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort';
import { STATUS_FULFILLED } from '@triniti/app/constants';
import { pbjxChannelNames } from '../../constants';
import schemas from './schemas';

/**
 * @param {Object} state       - The entire redux state.
 * @param {{ block }} ownProps - Props given to the screen.
 *
 * @returns {Object}
 */
export default (state, { block }) => {
  const { response, status, request } = getRequest(
    state,
    schemas.searchAssets.getCurie(),
    pbjxChannelNames.AUDIO_ASSET_SEARCH,
  );
  const audioAssetSort = (request && request.get('sort').getValue()) || SearchAssetsSort.CREATED_AT_DESC.getValue();
  const audioAssetNodes = (response && response.get('nodes')) || [];
  const isAudioAssetSearchFulfilled = status === STATUS_FULFILLED;

  return {
    audioAssetNodes,
    audioAssetSort,
    audioNode: block.has('node_ref') ? getNode(state, block.get('node_ref')) : null,
    imageNode: block.has('image_ref') ? getNode(state, block.get('image_ref')) : null,
    isAudioAssetSearchFulfilled,
  };
};
