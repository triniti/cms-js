import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import { callPbjx } from '@gdbots/pbjx/redux/actions';
import schemas from './schemas';

export default (dispatch) => ({
  /**
   * dispatches a search request
   * @param {string} q - search text
   */
  handleSearch: (q = '') => {
    const requestData = {
      count: 25,
      page: 1,
      q,
      sort: schemas.searchNodeSort.RELEVANCE,
      status: NodeStatus.PUBLISHED,
    };

    const request = schemas.searchNodes.createMessage(requestData);
    return dispatch(callPbjx(request));
  },
});
