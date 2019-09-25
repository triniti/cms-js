import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';

/**
 * Checks the status of the current node and
 * assign appropriate operation statuses values
 * (canPublish, canUnpublish, canMarkAsPending,
 * canMarkAsDraft) depending on the users granted rights.
 *
 * @param nodeStatus
 * @param operationGrantStatuses
 * @return {*}
 */
export default (nodeStatus, {
  isPublishNodeGranted,
  isUnpublishNodeGranted,
  isMarkNodeAsDraftGranted,
  isMarkNodeAsPendingGranted,
}) => {
  const defaultNodeOperationStatuses = {
    canPublish: false,
    canUnpublish: false,
    canMarkAsPending: false,
    canMarkAsDraft: false,
  };

  if (nodeStatus === NodeStatus.DRAFT) {
    return {
      canPublish: isPublishNodeGranted,
      canUnpublish: false,
      canMarkAsPending: isMarkNodeAsPendingGranted,
      canMarkAsDraft: false,
    };
  }

  if (nodeStatus === NodeStatus.PUBLISHED) {
    return {
      canPublish: false,
      canUnpublish: isUnpublishNodeGranted,
      canMarkAsPending: false,
      canMarkAsDraft: false,
    };
  }

  if (nodeStatus === NodeStatus.DELETED) {
    return {
      canPublish: false,
      canUnpublish: false,
      canMarkAsPending: false,
      canMarkAsDraft: isMarkNodeAsDraftGranted,
    };
  }

  if (nodeStatus === NodeStatus.SCHEDULED) {
    return {
      canPublish: isPublishNodeGranted,
      canUnpublish: false,
      canMarkAsPending: isMarkNodeAsPendingGranted,
      canMarkAsDraft: isMarkNodeAsDraftGranted,
    };
  }

  if (nodeStatus === NodeStatus.PENDING) {
    return {
      canPublish: isPublishNodeGranted,
      canUnpublish: false,
      canMarkAsPending: false,
      canMarkAsDraft: isMarkNodeAsDraftGranted,
    };
  }

  if (nodeStatus === NodeStatus.EXPIRED) {
    return {
      canPublish: false,
      canUnpublish: false,
      canMarkAsPending: false,
      canMarkAsDraft: isMarkNodeAsDraftGranted,
    };
  }

  return defaultNodeOperationStatuses;
};
