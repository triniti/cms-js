import React from 'react';
import classNames from 'classnames';
import { BackgroundImage } from 'components';
import {
  Card,
  CardImgOverlay,
  CardTitle,
  Col,
  Container,
  Media,
  Row,
} from 'reactstrap';
import damUrl from 'plugins/dam/damUrl';

const isGallery = (schema) => schema.indexOf('gallery') > -1;

const ImageGrid = ({
  nodes,
  onSelectImage,
  selectedImages = [],
}) => (
  <Container fluid className="gallery-grid-container h-100">
    <Row gutter="sm" className="m-0">
      {!!nodes.length && ( // hove effect of card
        <>
          <style>
          {`
            .image-grid-card:hover {
              background-color: #08a0e8;
            }
          `}
          </style>
          {nodes.map((node) => (
            <Col xs="12" sm="6" md="4" lg="3" xl="2p" key={node.get('_id')} className="col-xl-2p">
              <Card
                onClick={() => onSelectImage(node)}
                inverse
                role="presentation"
                color={ selectedImages.some((i) => `${i.get('_id')}` === `${node.get('_id')}`) ? 'success' : '' }
                className={classNames('shadow', 'p-2', 'image-grid-card')}
                style={{ cursor: 'pointer' }}
              >
                <Media className="aspect-ratio aspect-ratio-1by1 mt-0">
                  <BackgroundImage
                    imgSrc={damUrl(isGallery(`${node.schema()}`) ? node.get('image_ref') : node, '1by1', 'sm')}
                    alt="thumbnail"
                  />
                  <CardImgOverlay>
                    <CardTitle className="h5 mb-0">{node.get('title')}</CardTitle>
                  </CardImgOverlay>
                </Media>
              </Card>
            </Col>
          ))}
        </>
      )}
    </Row>
  </Container>
);

export default ImageGrid;
