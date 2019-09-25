import getBatchOperationState from '@triniti/cms/plugins/ncr/selectors/getBatchOperationState';
import searchScreenSelector from '@triniti/cms/plugins/ncr/screens/search-nodes/selector';
import { batchOperationStatuses } from '@triniti/cms/plugins/ncr/constants';
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
  const batchOperation = getBatchOperationState(state);

  return {
    getNode: (nodeRef) => getNode(state, nodeRef),
    ...searchScreen,
    disabled: !!(batchOperation && batchOperation.status !== batchOperationStatuses.DESTROYED),
    sort: (request && request.get('sort').toString()) || schemas.searchNodes.getField('sort').getDefault().getValue(),
    types: (request && request.has('types')) ? request.get('types') : [],
  };
};
