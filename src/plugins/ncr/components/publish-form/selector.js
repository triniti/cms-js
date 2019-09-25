import isGranted from '@triniti/cms/plugins/iam/selectors/isGranted';
import deriveNodeOperationStatuses from '../../utils/deriveNodeOperationStatuses';

/**
 * @param {Object} state     - The entire redux state.
 * @param {Object} ownProps  - Props given to the screen.
 *
 * @returns {Object}
 */
export default (state, { node, schemas }) => {
  const isPublishNodeGranted = schemas
    ? isGranted(state, schemas.publishNode.getCurie().toString()) : false;
  const isUnpublishNodeGranted = schemas
    ? isGranted(state, schemas.unpublishNode.getCurie().toString()) : false;
  const isMarkNodeAsDraftGranted = (schemas && schemas.markNodeAsDraft)
    && isGranted(state, schemas.markNodeAsDraft.getCurie().toString());
  const isMarkNodeAsPendingGranted = (schemas && schemas.markNodeAsPending)
    && isGranted(state, schemas.markNodeAsPending.getCurie().toString());

  const operationGrantStatuses = {
    isPublishNodeGranted,
    isUnpublishNodeGranted,
    isMarkNodeAsDraftGranted,
    isMarkNodeAsPendingGranted,
  };

  const {
    canMarkAsPending,
    canMarkAsDraft,
    canPublish,
    canUnpublish,
  } = deriveNodeOperationStatuses(node ? node.get('status') : 'UNSAVED', operationGrantStatuses);

  return {
    canMarkAsDraft,
    canMarkAsPending,
    canPublish,
    canUnpublish,
  };
};
