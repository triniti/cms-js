import searchScreenSelector from '@triniti/cms/plugins/ncr/screens/search-nodes/selector';
import SearchTeasersSort from '@triniti/schemas/triniti/curator/enums/SearchTeasersSort';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';
import schemas from './schemas';

/**
 * @param {Object} state    - The entire redux state.
 * @param {Object} ownProps - Props given to the screen.
 *
 * @returns {Object}
 */
export default (state, ownProps) => {
  const searchScreen = searchScreenSelector(state, ownProps, schemas);
  const { request } = searchScreen.searchNodesRequestState;

  return {
    getNode: (nodeRef) => getNode(state, nodeRef),
    ...searchScreen,
    sort: (request && request.get('sort').toString()) || SearchTeasersSort.RELEVANCE.getValue(),
    types: request ? request.get('types') || [] : [],
  };
};
