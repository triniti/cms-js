import React, { lazy } from 'react';
import { ButtonGroup} from 'reactstrap';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus.js';
import { CreateModalButton } from '@triniti/cms/components/index.js';
import deleteNode from '@triniti/cms/plugins/ncr/actions/deleteNode.js';
import markNodeAsDraft from '@triniti/cms/plugins/ncr/actions/markNodeAsDraft.js';
import markNodeAsPending from '@triniti/cms/plugins/ncr/actions/markNodeAsPending.js';
import publishNode from '@triniti/cms/plugins/ncr/actions/publishNode.js';
import unpublishNode from '@triniti/cms/plugins/ncr/actions/unpublishNode.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import useBatch from '@triniti/cms/plugins/ncr/components/batch-operations-card/useBatch.js';

export { useBatch };

const BatchOperationModal = lazy(() => import('@triniti/cms/plugins/ncr/components/batch-operation-modal/index.js'));

const publishOperation = async (dispatch, node) => {
  if (node.get('status') === NodeStatus.PUBLISHED) {
    throw new Error('Node is already published.');
  }

  await dispatch(publishNode(node.generateNodeRef()));
};

const markAsDraftOperation = async (dispatch, node) => {
  if (node.get('status') === NodeStatus.PUBLISHED) {
    throw new Error('Node must first be unpublished.');
  }

  if (node.get('status') === NodeStatus.DRAFT) {
    throw new Error('Node is already marked as draft.');
  }

  await dispatch(markNodeAsDraft(node.generateNodeRef()));
};

const markAsPendingOperation = async (dispatch, node) => {
  if (node.get('status') === NodeStatus.PUBLISHED) {
    throw new Error('Node must first be unpublished.');
  }

  if (node.get('status') === NodeStatus.PENDING) {
    throw new Error('Node is already marked as pending.');
  }

  await dispatch(markNodeAsPending(node.generateNodeRef()));
};

const unpublishOperation = async (dispatch, node) => {
  if (node.get('status') !== NodeStatus.PUBLISHED) {
    throw new Error('Node is not published.');
  }

  await dispatch(unpublishNode(node.generateNodeRef()));
};

const deleteOperation = async (dispatch, node) => {
  if (node.get('status') === NodeStatus.DELETED) {
    throw new Error('Node is already deleted.');
  }

  await dispatch(deleteNode(node.generateNodeRef()));
};

export default function BatchOperationsCard(props) {
  const { batch, schema, onComplete } = props;
  const qname = schema.getQName();
  const policy = usePolicy();
  const canDelete = policy.isGranted(`${qname}:delete`);
  const isPublishable = schema.hasMixin('gdbots:ncr:mixin:publishable');
  const canPublish = isPublishable && policy.isGranted(`${qname}:publish`);
  const canMarkAsDraft = isPublishable && policy.isGranted(`${qname}:mark-as-draft`);
  const canMarkAsPending = isPublishable && policy.isGranted(`${qname}:mark-as-pending`);
  const canUnpublish = isPublishable && policy.isGranted(`${qname}:unpublish`);

  return (
    <fieldset className="mb-3 d-flex align-items-center">
      <ButtonGroup className="btn-group--white flex-wrap shadow-sm">
        {canPublish && (
          <CreateModalButton
            text="Publish"
            color="outline-primary"
            modal={BatchOperationModal}
            modalProps={() => ({
              header: `Publish Nodes (${batch.size})`,
              completedText: 'Published',
              nodes: Array.from(batch.values()),
              operation: publishOperation,
              onComplete,
            })}
          />
        )}
        {canMarkAsDraft && (
          <CreateModalButton
            text="Mark As Draft"
            color="outline-light"
            modal={BatchOperationModal}
            modalProps={() => ({
              header: `Mark Nodes (${batch.size}) As Draft`,
              completedText: 'Marked As Draft',
              nodes: Array.from(batch.values()),
              operation: markAsDraftOperation,
              onComplete,
            })}
          />
        )}
        {canMarkAsPending && (
          <CreateModalButton
            text="Mark As Pending"
            color="outline-light"
            modal={BatchOperationModal}
            modalProps={() => ({
              header: `Mark Nodes (${batch.size}) As Pending`,
              completedText: 'Marked As Pending',
              nodes: Array.from(batch.values()),
              operation: markAsPendingOperation,
              onComplete,
            })}
          />
        )}
        {canUnpublish && (
          <CreateModalButton
            text="Unpublish"
            color="outline-warning"
            modal={BatchOperationModal}
            modalProps={() => ({
              header: `Unpublish Nodes (${batch.size})`,
              completedText: 'Unpublished',
              nodes: Array.from(batch.values()),
              operation: unpublishOperation,
              onComplete,
            })}
          />
        )}
        {canDelete && (
          <CreateModalButton
            text="Delete"
            color="outline-danger"
            modal={BatchOperationModal}
            modalProps={() => ({
              header: `Delete Nodes (${batch.size})`,
              completedText: 'Deleted',
              nodes: Array.from(batch.values()),
              operation: deleteOperation,
              onComplete,
            })}
          />
        )}
      </ButtonGroup>
      <legend className="h3 mb-0">
        <span className="badge bg-info rounded-pill">{batch.size}</span> <span className="h4">{batch.size > 1 ? 'nodes' : 'node'}</span>
      </legend>
    </fieldset>
  );
}
