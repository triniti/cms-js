import React, { useState } from 'react';
import { Button } from 'reactstrap';
// import BatchEditModal from 'plugins/dam/components/batch-edit-modal';

export default ({
  assetIds = [],
  children = 'Batch Edit',
  editMode = false,
  nodeRef,
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
      />
      )}
    </>
  );
}