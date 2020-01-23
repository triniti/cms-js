import { STATUS_FAILED, STATUS_FULFILLED, STATUS_REJECTED } from '@triniti/app/constants';
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
  const isFailed = status === STATUS_FAILED;
  const isFulfilled = status === STATUS_FULFILLED;
  const isRejected = status === STATUS_REJECTED;
  const assets = (response && response.get('nodes')) || [];
  const currentPage = (request && request.get('page')) || 1;
  const q = (request && request.get('q')) || '';
  const sort = (request && request.get('sort').getValue()) || '';

  return {
    currentPage,
    isFailed,
    isFulfilled,
    isRejected,
    q,
    searchVideoAssetsRequestState,
    sort,
    assets,
  };
};
