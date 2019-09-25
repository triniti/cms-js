import { STATUS_FULFILLED } from '@triniti/app/constants';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';
import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest';
import schemas from './schemas';
import { pbjxChannelNames } from '../../constants';

/**
 * @param {Object} state       - The entire redux state.
 * @param {{ block }} ownProps - Props given to the screen.
 *
 * @returns {Object}
 */
export default (state, { block }) => {
  const searchRequest = getRequest(
    state,
    schemas.searchNodes.getCurie(),
    pbjxChannelNames.POLL_SEARCH,
  );
  const { request, response, status } = searchRequest;

  return {
    poll: block.has('node_ref') ? getNode(state, block.get('node_ref')) : null,
    polls: (response && response.get('nodes')) || [],
    sort: request ? request.get('sort').getValue() : schemas.searchNodesSort.CREATED_AT_DESC.getValue(),
    isFulfilled: status === STATUS_FULFILLED,
  };
};
