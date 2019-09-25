import isGranted from '@triniti/cms/plugins/iam/selectors/isGranted';
import getBatchOperationState from '../../selectors/getBatchOperationState';
import getSearchNodesState from '../../selectors/getSearchNodesState';
import { batchOperationStatuses, searchViewTypes } from '../../constants';

const { TABLE } = searchViewTypes;
/**
 * @param {Object} state     - The entire redux state.
 * @param {Object} ownProps  - Props given to the screen.
 *
 * @returns {Object}
 */
export default (state, { schemas }) => {
  const canDeleteNode = schemas.deleteNode
    && isGranted(state, schemas.deleteNode.getCurie().toString());
  const canPublishNode = schemas.publishNode
    && isGranted(state, schemas.publishNode.getCurie().toString());
  const canMarkNodeAsDraft = schemas.markNodeAsDraft
    && isGranted(state, schemas.markNodeAsDraft.getCurie().toString());
  const batchOperation = getBatchOperationState(state);
  const searchNodesState = getSearchNodesState(state, schemas.searchNodes.getCurie());
  const view = (searchNodesState && searchNodesState.view) || TABLE;
  const disabled = !!(batchOperation && batchOperation.status !== batchOperationStatuses.DESTROYED);

  return {
    disabled,
    canDeleteNode,
    canMarkNodeAsDraft,
    canPublishNode,
    view,
  };
};
