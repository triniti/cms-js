import throttle from 'lodash/throttle';
import clearChannel from '@triniti/cms/plugins/pbjx/actions/clearChannel';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import searchNodes from '@triniti/cms/plugins/ncr/actions/searchNodes';
import schemas from './schemas';
import { pbjxChannelNames } from '../../constants';

const STATUSES = [NodeStatus.PUBLISHED.getValue(), NodeStatus.SCHEDULED.getValue()];

export default (dispatch) => ({
  handleClearArticleChannel: () => {
    dispatch(clearChannel(pbjxChannelNames.ARTICLE_SEARCH));
  },

  /**
   * @param {Object} data - pbj search request data except 'page'
   */
  handleSearchArticles: throttle((data = {}) => {
    dispatch(searchNodes(schemas.searchArticles.createMessage({
      count: data.count || 50,
      page: 1,
      statuses: STATUSES,
      ...data,
    }), pbjxChannelNames.ARTICLE_SEARCH));
  }, 500),
});
