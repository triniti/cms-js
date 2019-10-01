import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';
import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest';
import SearchArticlesSort from '@triniti/schemas/triniti/news/enums/SearchArticlesSort';
import { STATUS_FULFILLED } from '@triniti/app/constants';
import schemas from './schemas';
import { pbjxChannelNames } from '../../constants';

/**
 * @param {Object} state       - The entire redux state.
 * @param {{ block, node }} ownProps - Props given to the screen.
 *
 * @returns {Object}
 */
export default (state, { block, node }) => {
  const { request, response, status } = getRequest(
    state, schemas.searchArticles.getCurie(), pbjxChannelNames.ARTICLE_SEARCH,
  );
  const isArticleRequestFulfilled = status === STATUS_FULFILLED;
  const articleNodes = (response && response.get('nodes')) || [];
  const articleSort = (request && request.get('sort').getValue()) || SearchArticlesSort.ORDER_DATE_DESC.getValue();

  return {
    articleNode: block.has('node_ref') ? getNode(state, block.get('node_ref')) : null,
    articleNodes: articleNodes.filter((articleNode) => !articleNode.get('_id').toNodeRef().equals(node.get('_id').toNodeRef())),
    articleSort,
    getNode: (nodeRef) => getNode(state, nodeRef),
    imageRef: block.has('image_ref') ? block.get('image_ref') : null,
    isArticleRequestFulfilled,
  };
};
