import getRequest from '@triniti/cms/plugins/pbjx/selectors/getCommand';
import { STATUS_FULFILLED, STATUS_NONE } from '@triniti/app/constants';
import schemas from './schemas';
import { pbjxChannelNames } from '../../constants';

/**
 * @param {Object} state - The entire redux state.
 *
 * @returns {Object}
 */
export default (state) => {
  const searchNodesRequestState = getRequest(
    state,
    schemas.searchNodesRequest.getCurie(),
    pbjxChannelNames.GALLERY_MEDIA_SEARCH,
  );
  const { response, status } = searchNodesRequestState;
  const isLoading = (status !== STATUS_FULFILLED && status !== STATUS_NONE);

  return {
    hasMore: response ? response.get('has_more') : false,
    isLoading,
    requestRef: response ? response.get('ctx_request_ref') : null,
    searchNodesRequestState,
    searchPage: response ? response.get('ctx_request').get('page') : 1,
    searchResults: (response && response.get('nodes')) || [],
  };
};
