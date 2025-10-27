import React, { lazy } from 'react';
import { Button, CardHeader, Spinner } from 'reactstrap';
import { ActionButton, CreateModalButton, Icon } from '@triniti/cms/components/index.js';

const AddImagesModal = lazy(() => import('@triniti/cms/plugins/curator/components/gallery-screen/images-tab/AddImagesModal.js'));
const PatchAssetsModal = lazy(() => import('@triniti/cms/plugins/dam/components/patch-assets-modal/index.js'));

function Header (props) {
  const { delegate, nodeRef } = props;
  const { 
    batch,
    canPatch, 
    canReorder,
    isReordering, 
    isRunning, 
    total 
  } = delegate;

  return (
    <CardHeader>
      <span>Images{total > 0 ? ` (${total})` : ''} {isRunning && <Spinner />}</span>
      <span>
        {canReorder && isReordering && (
          <>
            <ActionButton
              text="Revert"
              icon="revert"
              size="sm"
              color="light"
              onClick={delegate.handleRevertReordering}
            />
            <ActionButton
              text="Save Reordering"
              icon="save-diskette"
              size="sm"
              color="primary"
              onClick={delegate.handleReorderImages}
            />
          </>
        )}
        {canReorder && !isReordering && (
          <>
            {batch.size > 0 && (
              <>
                {canPatch && (
                  <CreateModalButton
                    text={`Patch Images (${batch.size})`}
                    color="light"
                    icon="edit"
                    size="sm"
                    modal={PatchAssetsModal}
                    modalProps={() => ({
                      nodes: Array.from(batch.values()),
                      onComplete: batch.reset,
                    })}
                  />
                )}
                <ActionButton
                  text={`Remove Images (${batch.size})`}
                  icon="minus-outline"
                  size="sm"
                  color="danger"
                  onClick={delegate.handleRemoveImages}
                />
              </>
            )}
            {batch.size === 0 && (
              <CreateModalButton
                text="Add Images"
                icon="plus-outline"
                size="sm"
                modal={AddImagesModal}
                modalProps={{
                  galleryRef: nodeRef,
                  gallerySeqIncrementer: delegate.incrementer,
                  onClose: delegate.handleImagesAdded,
                }}
              />
            )}
          </>
        )}
        {!isReordering && batch.size === 0 && (
          <Button color="light" size="sm" onClick={delegate.handleRefresh} disabled={isRunning}>
            <Icon imgSrc="refresh" />
          </Button>
        )}
      </span>
    </CardHeader>
  )
}

export default Header;