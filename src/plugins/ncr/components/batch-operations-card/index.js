import React, { lazy } from 'react';
import { Card, CardBody } from 'reactstrap';
import { CreateModalButton } from '@triniti/cms/components/index.js';
import deleteNode from 'plugins/ncr/actions/deleteNode';
import markNodeAsDraft from 'plugins/ncr/actions/markNodeAsDraft';
import publishNode from 'plugins/ncr/actions/publishNode';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import noop from 'lodash-es/noop';

const BatchOperationModal = lazy(() => import('plugins/ncr/components/batch-operation-modal'));

const BATCH_OPERATION_PUBLISH = 'publish';
const BATCH_OPERATION_DRAFT = 'draft';
const BATCH_OPERATION_DELETE = 'delete';

const batchOperation = action => async (dispatch, node) => {
  switch (action) {
    case BATCH_OPERATION_PUBLISH:
      await dispatch(publishNode(NodeRef.fromNode(node)));
      break;
    case BATCH_OPERATION_DRAFT:
      await dispatch(markNodeAsDraft(NodeRef.fromNode(node)));
      break;
    case BATCH_OPERATION_DELETE:
      await dispatch(deleteNode(NodeRef.fromNode(node)));
      break;
    default:
      throw new Error('Unsupported action.');
      break;
  }
};

const BatchOperationsCard = ({
  nodes,
  run,
  selected = [],
  setSelected = noop,
  setAllSelected = noop,
  canDelete = true,
  canDraft = true,
  canPublish = true,
}) => {
  if (!selected.length) {
    return null;
  }

  const filteredNodes = nodes.filter((node) => selected.includes(`${node.get('_id')}`));
  const handleCompleted = () => {
    setSelected([]);
    setAllSelected(false);
    run();
  };

  return (
  <Card>
    <CardBody className="d-flex flex-row">
      <div>
        <div className="btn-group" role="group" aria-label="Basic example">
          {canPublish && <CreateModalButton
            text="Publish"
            modal={BatchOperationModal}
            modalProps={{
              header: 'Publish Article(s)',
              runningText: 'Publishing...',
              completedText: 'Published.',
              nodes: filteredNodes,
              operation: batchOperation(BATCH_OPERATION_PUBLISH),
              onComplete: handleCompleted,
            }}
            color="outline-primary"
          />}
          {canDraft && <CreateModalButton
            text="Draft"
            modal={BatchOperationModal}
            modalProps={{
              header: 'Mark Article(s) as Draft',
              runningText: 'Saving as draft...',
              completedText: 'Draft saved.',
              nodes: filteredNodes,
              operation: batchOperation(BATCH_OPERATION_DRAFT),
              onComplete: handleCompleted,
            }}
            color="outline-warning"
          />}
          {canDelete && <CreateModalButton
            text="Delete"
            modal={BatchOperationModal}
            modalProps={{
              header: 'Delete Articles',
              runningText: 'Deleting...',
              completedText: 'Deleted.',
              nodes: filteredNodes,
              operation: batchOperation(BATCH_OPERATION_DELETE),
              onComplete: handleCompleted,
            }}
            color="outline-danger"
          />}
        </div>
      </div>
      <div style={{ marginLeft: '1rem', marginTop: '10px', textTransform: 'uppercase', color: '#8a8a8c', fontWeight: 500 }} className='align-middle'>
        {selected.length} items
      </div>
    </CardBody>
  </Card>
  );
}

export default BatchOperationsCard;
