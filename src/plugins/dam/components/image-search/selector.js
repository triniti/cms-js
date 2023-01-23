import getRequest from 'plugins/pbjx/selectors/getCommand';
import { STATUS_FAILED, STATUS_FULFILLED, STATUS_REJECTED } from 'constants';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import schemas from './schemas';
import { pbjxChannelNames } from './constants';

/**
 * @param {Object} state - The entire redux state.
 *
 * @returns {Object}
 */
export default (state) => {
  const searchImagesRequestState = getRequest(
    state,
    schemas.searchNodes.getCurie(),
    pbjxChannelNames.IMAGE_SEARCH,
  );
  const { request, response, status } = searchImagesRequestState;
  const isFailed = status === STATUS_FAILED;
  const isFulfilled = status === STATUS_FULFILLED;
  const isRejected = status === STATUS_REJECTED;
  const images = (response && response.get('nodes')) || [];
  const statuses = [NodeStatus.PUBLISHED.getValue()];
  const currentPage = (request && request.get('page')) || 1;
  const q = (request && request.get('q')) || '';

  return {
    currentPage,
    images,
    isFailed,
    isFulfilled,
    isRejected,
    q,
    searchImagesRequestState,
    statuses,
  };
};
