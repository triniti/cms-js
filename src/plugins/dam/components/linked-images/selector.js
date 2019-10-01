import { STATUS_FULFILLED, STATUS_NONE } from '@triniti/app/constants';
import getRequest from '@triniti/cms/plugins/pbjx/selectors/getCommand';
import { pbjxChannelNames } from './constants';
import schemas from './schemas';

/**
 * @param {Object} state - The entire redux state.
 *
 * @returns {Object}
 */
export default (state) => {
  const searchNodesRequestState = getRequest(
    state,
    schemas.searchNodesRequest.getCurie(),
    pbjxChannelNames.LINKED_IMAGES_SEARCH,
  );
  const { response, status } = searchNodesRequestState;
  const requestRef = response ? response.get('ctx_request_ref') : null;
  const isLoading = (status !== STATUS_FULFILLED && status !== STATUS_NONE);

  const total = response ? response.get('total') : 0;
  const hasMore = response ? response.get('has_more') : false;

  const searchResults = (response && response.get('nodes')) || [];
  const searchPage = response ? response.get('ctx_request').get('page') : 1;

  return {
    hasMore,
    isLoading,
    requestRef,
    searchNodesRequestState,
    searchPage,
    searchResults,
    total,
  };
};
