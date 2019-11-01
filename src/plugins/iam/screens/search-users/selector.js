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
  const isStaff = (request && request.get('is_staff')) || 0;
  const q = (request && request.get('q')) || '';
  const status = (request && request.has('status') && request.get('status').toString())
    || schemas.node.getField('status').getDefault().getValue();

  return {
    ...searchScreen,
    isStaff,
    q,
    status,
  };
};
