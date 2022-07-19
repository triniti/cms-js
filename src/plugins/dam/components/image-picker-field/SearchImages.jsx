import React from 'react';
import { Card, CardImgOverlay, CardTitle, Col, Media, Row } from 'reactstrap';
import { Loading, withForm } from 'components';
import damUrl from 'plugins/dam/damUrl';
import useRequest from 'plugins/pbjx/components/useRequest';
import withRequest from 'plugins/pbjx/components/with-request';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort';
import SearchForm from 'plugins/dam/components/image-picker-field/SearchForm';

function SearchImages(props) {
  const { request, selectImage, toggle } = props;
  const { response, run, isRunning, pbjxError } = useRequest(request, true);

  return(
    <>
      <SearchForm {...props} isRunning={isRunning} run={run} />
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
    </>
  );
}

export default withRequest(withForm(SearchImages), 'triniti:dam:request:search-assets-request', {
  channel: 'picker',
  initialData: {
    count: 60,
    sort: SearchAssetsSort.RELEVANCE.getValue(),
    types: ['image-asset'],
    autocomplete: true,
  }
});
