import React, { lazy } from 'react';
import { Button, Card, CardBody, CardHeader, CardText, Row, Spinner } from 'reactstrap';
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort.js';
import { ActionButton, CreateModalButton, Icon, Loading } from '@triniti/cms/components/index.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import useDelegate from '@triniti/cms/plugins/curator/components/gallery-screen/images-tab/useDelegate.js';
import SortableImage from '@triniti/cms/plugins/curator/components/gallery-screen/images-tab/SortableImage.js';

const AddImagesModal = lazy(() => import('@triniti/cms/plugins/curator/components/gallery-screen/images-tab/AddImagesModal.js'));
const PatchAssetsModal = lazy(() => import('@triniti/cms/plugins/dam/components/patch-assets-modal/index.js'));

function ImagesTab(props) {
  const { nodeRef } = props;
  const delegate = useDelegate(props);
  const {
    batch,
    ids,
    nodes,
    total,
    canPatch,
    canReorder,
    isReordering,
    pbjxError,
    isRunning
  } = delegate;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      },
    }),
  );

  return (
    <Card>
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
                    gallerySeqIncrementer: delegate.gallerySeqIncrementer,
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
      <CardBody className="p-0">
        {((!ids.length && isRunning) || pbjxError) && <Loading error={pbjxError} />}

        {!isRunning && !ids.length && (
          <CardText className="p-5">
            No images have been added to this gallery.
          </CardText>
        )}

        {ids.length > 0 && (
          <DndContext onDragEnd={delegate.handleDragEnd} sensors={sensors} collisionDetection={closestCenter}>
            <SortableContext items={ids} strategy={rectSortingStrategy}>
              <div className="p-3" style={{ minHeight: '152px' }}>
                <Row className="m-0 g-1">
                  {ids.map((id, index) => {
                    if (!nodes[id]) {
                      return null;
                    }

                    return (
                      <SortableImage
                        key={id}
                        id={id}
                        index={index}
                        node={nodes[id]}
                        batch={batch}
                        canReorder={canReorder}
                        isReordering={isReordering}
                      />
                    );
                  })}
                </Row>
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardBody>
    </Card>
  );
}

export default withRequest(ImagesTab, 'triniti:dam:request:search-assets-request', {
  channel: 'tab',
  initialData: {
    count: 255,
    sort: SearchAssetsSort.GALLERY_SEQ_DESC.getValue(),
    types: ['image-asset'],
    track_total_hits: true,
  }
});
