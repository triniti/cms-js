import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest';
import schemas from './schemas';
import { pbjxChannel } from '../../constants';

/**
 * @param {Object} state - The entire redux state.
 *
 * @returns {Object}
 */
export default (state) => {
  const searchNodesRequestState = getRequest(
    state,
    schemas.searchNodes.getCurie(),
    pbjxChannel.ARTICLE_NOTIFICATIONS,
  );

  return { searchNodesRequestState };
};
