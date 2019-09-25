import searchNodes from '@triniti/cms/plugins/ncr/actions/searchNodes';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import clearChannel from '@triniti/cms/plugins/pbjx/actions/clearChannel';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort';
import schemas from './schemas';
import { pbjxChannelNames } from './constants';

const STATUSES = [NodeStatus.PUBLISHED.getValue(), NodeStatus.SCHEDULED.getValue()];

export default (dispatch) => ({
  /**
   * @param {Object} data - pbj search request data except 'page'
   * @param {number} page - paginated page number
   */
  handleSearch: (data = {}, page = 1) => {
    const requestData = Object.assign(data, {
      count: 150,
      sort: SearchAssetsSort.CREATED_AT_DESC.getValue(),
      statuses: STATUSES,
      page,
      ...data,
    });

    const request = schemas.searchNodes.createMessage(requestData);
    dispatch(searchNodes(request, pbjxChannelNames.IMAGE_SEARCH));
  },

  handleClearChannel: () => dispatch(clearChannel(pbjxChannelNames.IMAGE_SEARCH)),
});
