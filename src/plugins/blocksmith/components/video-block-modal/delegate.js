import clearChannel from '@triniti/cms/plugins/pbjx/actions/clearChannel';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import searchNodes from '@triniti/cms/plugins/ncr/actions/searchNodes';
import schemas from './schemas';
import { pbjxChannelNames } from '../../constants';

const STATUSES = [NodeStatus.PUBLISHED.getValue(), NodeStatus.SCHEDULED.getValue()];

export default (dispatch) => ({
  handleClearChannel: () => {
    dispatch(clearChannel(pbjxChannelNames.VIDEO_SEARCH));
  },

  /**
   * @param {Object} data - pbj search request data
   */
  handleSearch: (data = {}) => {
    dispatch(searchNodes(schemas.searchNodes.createMessage({
      count: 50,
      page: 1,
      sort: schemas.searchNodesSort.ORDER_DATE_DESC.getValue(),
      statuses: STATUSES,
      ...data,
    }), pbjxChannelNames.VIDEO_SEARCH));
  },
});
