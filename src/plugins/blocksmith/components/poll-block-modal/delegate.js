import clearChannel from '@triniti/cms/plugins/pbjx/actions/clearChannel';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import searchNodes from '@triniti/cms/plugins/ncr/actions/searchNodes';
import { pbjxChannelNames } from '../../constants';
import schemas from './schemas';

const STATUSES = [NodeStatus.PUBLISHED.getValue(), NodeStatus.SCHEDULED.getValue()];

export default (dispatch) => ({
  /**
   * @param {Object} data - pbj search request data except 'page'
   * @param {number} page - paginated page number
   */
  handleSearch: (data = {}, page = 1) => {
    dispatch(searchNodes(schemas.searchNodes.createMessage({
      count: 50,
      page,
      sort: schemas.searchNodesSort.ORDER_DATE_DESC.getValue(),
      statuses: STATUSES,
      ...data,
    }), pbjxChannelNames.POLL_SEARCH));
  },

  handleClearChannel: () => {
    dispatch(clearChannel(pbjxChannelNames.POLL_SEARCH));
  },
});
