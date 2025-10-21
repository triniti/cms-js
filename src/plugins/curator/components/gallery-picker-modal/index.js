import React from 'react';
import { Modal, ModalBody, ModalHeader, Card, Col, Container, Media, Row, UncontrolledTooltip } from 'reactstrap';
import { ErrorBoundary, Loading, Pager, withForm } from '@triniti/cms/components/index.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import SearchGalleriesSort from '@triniti/schemas/triniti/curator/enums/SearchGalleriesSort.js';
import SearchForm from '@triniti/cms/plugins/curator/components/search-galleries-screen/SearchForm.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';

function GalleryGrid ({ nodes, onSelect }) {
  return (
    <Container fluid className="gallery-grid-container h-100">
      <Row className="m-0 g-2 p-2">
        {nodes.map(node => {
          const id = node.get('_id');
          const key = `gallery-${id.toString()}`;
          const imgSrc = node.has('image_ref') ? damUrl(node.get('image_ref'), '1by1', 'sm') : null;
          return (
            <Col key={key} id={key} xs={12} sm={6} md={4} lg={3} xl="2p">
              <Card
                inverse
                tag="button"
                className="p-1 mb-0 image-grid-card cursor-pointer"
                onClick={() => onSelect(node.generateNodeRef())}
              >
                <Media className="ratio ratio-1x1 mt-0 mb-0 border border-4 bg-dark" 
                       style={{ '--bs-border-color': 'var(--bs-body-bg)' }}>
                  {imgSrc && <img src={imgSrc} alt="" className="w-100 h-100 object-fit-cover" />}
                  {!imgSrc && (
                    <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                      <span>No Image</span>
                    </div>
                  )}
                </Media>
              </Card>
              <UncontrolledTooltip target={key} placement="bottom">
                {node.get('title')}
              </UncontrolledTooltip>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

function GalleryPickerModal (props) {
  const { onSelect = () => {}, request, delegate } = props;
  const { response, pbjxError, isRunning, run } = useRequest(request);

  const handleSelect = (ref) => {
    onSelect(ref);
    props.toggle();
  };

  return (
    <Modal isOpen backdrop="static" size="xxl" centered>
      <ModalHeader toggle={props.toggle}>Select Gallery</ModalHeader>
      <ModalBody className="p-2">
        <div className="scrollable-container modal-scrollable--tabs">
          <ErrorBoundary>
            <SearchForm {...props} isRunning={isRunning} run={run} />
          </ErrorBoundary>
          {(!response || pbjxError) && <Loading error={pbjxError} />}
          {response && (
            <div className="border-top border-light-subtle border-3">
              {!response.has('nodes') && (
                <p className="p-5">No galleries found.</p>
              )}
              {response.has('nodes') && (
                <GalleryGrid nodes={response.get('nodes')} onSelect={handleSelect} />
              )}
              <Pager
                disabled={isRunning}
                hasMore={response.get('has_more')}
                page={request.get('page')}
                perPage={request.get('count')}
                total={response.get('total')}
                onChangePage={delegate.handleChangePage}
              />
            </div>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
}

export default withRequest(withForm(GalleryPickerModal), 'triniti:curator:request:search-galleries-request', {
  channel: 'modal',
  initialData: {
    count: 30,
    sort: SearchGalleriesSort.ORDER_DATE_DESC.getValue(),
    track_total_hits: true,
  }
});
