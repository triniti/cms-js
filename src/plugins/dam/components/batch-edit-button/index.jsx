import React, { useState } from 'react';
import { Button } from 'reactstrap';
import BatchEditModal from 'plugins/dam/components/batch-edit-modal';
import noop from 'lodash-es/noop';

export default ({
  assetIds = [],
  children = 'Batch Edit',
  editMode = false,
  nodeRef,
  onAfterBatchEdit = noop,
  ...btnProps
}) => {
  const [ isBatchEditOpen, setIsBatchEditOpen ] = useState(false);

  const handleToggleBatchEdit = () => {
    setIsBatchEditOpen(!isBatchEditOpen);
  }

  return (
    <>
      <Button
        disabled={!editMode || !assetIds.length}
        onClick={handleToggleBatchEdit}
        {...btnProps}
      >
        {children}
      </Button>
      {isBatchEditOpen
      && (
      <BatchEditModal
        assetIds={assetIds}
        isOpen={isBatchEditOpen}
        nodeRef={nodeRef}
        onToggleBatchEdit={handleToggleBatchEdit}
        onAfterBatchEdit={onAfterBatchEdit}
      />
      )}
    </>
  );
}