import { STATUS_FULFILLED } from '@triniti/app/constants';
import getRequest from '@triniti/cms/plugins/pbjx/selectors/getCommand';
import { pbjxChannelNames } from './constants';
import schemas from './schemas';

/**
 * @param {Object} state - The entire redux state.
 *
 * @returns {Object}
 */
export default (state) => {
  const searchVideoAssetsRequestState = getRequest(
    state,
    schemas.searchNodes.getCurie(),
    pbjxChannelNames.VIDEO_ASSET_SEARCH,
  );
  const { request, response, status } = searchVideoAssetsRequestState;
  const isFulfilled = status === STATUS_FULFILLED;
  const assets = (response && response.get('nodes')) || [];
  const q = (request && request.get('q')) || '';
  const sort = (request && request.get('sort').getValue()) || '';

  return {
    assets,
    isFulfilled,
    q,
    searchVideoAssetsRequestState,
    sort,
  };
};
