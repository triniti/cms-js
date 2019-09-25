import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest';
import schemas from './schemas';
import { pbjxChannelNames } from './constants';

/**
 * @param {Object} state - The entire redux state.
 *
 * @returns {Object}
 */
export default (state) => ({
  searchNodesRequestState: getRequest(
    state,
    schemas.searchNodesRequest.getCurie(),
    pbjxChannelNames.MEDIA_SEARCH,
  ),
});
