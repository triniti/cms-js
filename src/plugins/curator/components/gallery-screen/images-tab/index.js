import React, { lazy } from 'react';
import { Card, CardBody, CardText, Row } from 'reactstrap';
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort.js';
import Header from '@triniti/cms/plugins/curator/components/gallery-screen/images-tab/Header.js';
import { Loading, Pager } from '@triniti/cms/components/index.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import useDelegate from '@triniti/cms/plugins/curator/components/gallery-screen/images-tab/useDelegate.js';
import SortableImage from '@triniti/cms/plugins/curator/components/gallery-screen/images-tab/SortableImage.js';

function ImagesTab (props) {
  const { nodeRef, request } = props;
  const delegate = useDelegate(props);
  const {
    batch,
    ids,
    seqs,
    images,
    canReorder,
    isReordering,
    response,
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
      <CardBody className="p-0">
        {((!ids.length && isRunning) || pbjxError) && <Loading error={pbjxError} />}
        <Header 
          delegate={delegate} 
          nodeRef={nodeRef} 
        />
        {!isRunning && !ids.length && (
          <CardText className="p-5">
            No images have been added to this gallery.
          </CardText>
        )}

        {ids.length > 0 && (
          <DndContext onDragEnd={delegate.handleDragEnd} sensors={sensors} collisionDetection={closestCenter}>
            <SortableContext items={ids} strategy={rectSortingStrategy}>
              <div className="p-3" style={{ minHeight: '152px' }}>
                <Row className="m-0 mb-2 g-1">
                  {ids.map((id, index) => {
                    if (!images[id]) {
                      return null;
                    }

                    return (
                      <SortableImage
                        key={id}
                        id={id}
                        index={index}
                        seq={seqs[index]}
                        image={images[id]}
                        batch={batch}
                        canReorder={canReorder}
                        isReordering={isReordering}
                      />
                    );
                  })}
                </Row>

                <Pager
                  disabled={isRunning}
                  hasMore={response.get('has_more')}
                  page={request.get('page')}
                  perPage={request.get('count')}
                  total={response.get('total')}
                  onChangePage={delegate.handleChangePage}
                />
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
