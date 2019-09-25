import searchScreenSelector from '@triniti/cms/plugins/ncr/screens/search-nodes/selector';
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
    ...searchScreen,
    sort: (request && request.get('sort').toString()) || schemas.searchNodes.getField('sort').getDefault().getValue(),
    types: request ? request.get('types') || [] : [],
  };
};
