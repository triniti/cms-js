import React, { lazy } from 'react';
import { ButtonGroup} from 'reactstrap';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus.js';
import { CreateModalButton } from '@triniti/cms/components/index.js';
import deleteNode from '@triniti/cms/plugins/ncr/actions/deleteNode.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';

const BatchOperationModal = lazy(() => import('@triniti/cms/plugins/ncr/components/batch-operation-modal/index.js'));
const PatchAssetsModal = lazy(() => import('@triniti/cms/plugins/dam/components/patch-assets-modal/index.js'));

const deleteOperation = async (dispatch, node) => {
  if (node.get('status') === NodeStatus.DELETED) {
    throw new Error('Asset is already deleted.');
  }

  await dispatch(deleteNode(node.generateNodeRef()));
};

export default function BatchOperationsCard(props) {
  const { batch, schema, onComplete } = props;
  const qname = schema.getQName();
  const policy = usePolicy();
  const canDelete = policy.isGranted(`${qname}:delete`);
  const canPatch = policy.isGranted(`${qname}:patch`);

  return (
    <fieldset className="mb-3 d-flex align-items-center">
      <ButtonGroup className="btn-group--white flex-wrap shadow-sm">
        {canPatch && (
          <CreateModalButton
            text="Patch"
            color="light"
            icon="edit"
            outline
            modal={PatchAssetsModal}
            modalProps={() => ({
              nodes: Array.from(batch.values()),
              onComplete,
            })}
          />
        )}
        {canDelete && (
          <CreateModalButton
            text="Delete"
            color="danger"
            icon="trash"
            outline
            modal={BatchOperationModal}
            modalProps={() => ({
              header: `Delete Assets (${batch.size})`,
              completedText: 'Deleted',
              nodes: Array.from(batch.values()),
              operation: deleteOperation,
              onComplete,
            })}
          />
        )}
      </ButtonGroup>
      <legend className="h3 mb-0">
        <span className="badge bg-info rounded-pill">{batch.size}</span> <span className="h4">{batch.size > 1 ? 'assets' : 'asset'}</span>
      </legend>
    </fieldset>
  );
}
