import React, { useEffect } from 'react';
import { Card, CardImgOverlay, CardTitle, Col, Media, Row } from 'reactstrap';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import { ActionButton, Loading, withForm } from 'components';
import damUrl from 'plugins/dam/damUrl';
import useRequest from 'plugins/pbjx/components/useRequest';
import withRequest from 'plugins/pbjx/components/with-request';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort';

function LinkedImages(props) {
  const { request, nodeRef, selectActiveTab, selectImage, toggle } = props;
  const { response, pbjxError } = useRequest(request, true);

  useEffect(() => {
    if (!request || !nodeRef) {
      return;
    }

    request.set('linked_ref', NodeRef.fromString(nodeRef));
  }, [nodeRef, request]);

  return (
    <>
      {(!response || pbjxError) && <Loading error={pbjxError} />}
      {response && response.has('nodes') && (
        <div className="image-grid-container">
          <Row className="gx-3">
            {response.get('nodes').map(node => {
              return (
                <Col key={node.get('_id')} xs={12} sm={6} md={4} lg={3} className="col-xl-2p">
                  <Card
                    className="p-2 card-hover-border card-shadow text-white"
                    onClick={() => {
                      selectImage(node.generateNodeRef());
                      toggle();
                    }}
                  >
                    <Media className="aspect-ratio aspect-ratio-1by1">
                      <Media
                        object
                        src={damUrl(node, '1by1', 'sm')}
                        alt="thumbnail"
                        width="200"
                        height="200"
                      />
                      <CardImgOverlay>
                        <CardTitle className="h5 mb-0">{node.get('title')}</CardTitle>
                      </CardImgOverlay>
                    </Media>
                  </Card>
                </Col>
              );
            }
            )}
          </Row>
        </div>
      )}
      {response && !response.has('nodes') && (
        <div className="not-found-message">
          No linked images found. You can
          <ActionButton
            text="upload"
            icon="upload"
            style={{ margin: "0 5px" }}
            color="light"
            outline
          /> new images or
          <ActionButton
            text="search"
            icon="search"
            onClick={() => selectActiveTab('search-images')}
            style={{ margin: "0 5px" }}
            color="light"
            outline
          /> search
          to find unlink images.
        </div>
      )}
    </>
  );
}

export default withRequest(withForm(LinkedImages), 'triniti:dam:request:search-assets-request', {
  channel: 'picker',
  initialData: {
    sort: SearchAssetsSort.RELEVANCE.getValue(),
    types: ['image-asset'],
    autocomplete: true,
  }
});
