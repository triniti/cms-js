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

const ImageGrid = ({
  images,
  onSelectImage,
  selectedImages,
}) => (
  <Container fluid className="gallery-grid-container">
    <Row gutter="sm" className="m-0">
      {!!images.length && ( // hove effect of card
        <>
          <style>
          {`
            .image-grid-card:hover {
              background-color: #08a0e8;
            }
          `}
          </style>
          {images.map((image) => (
            <Col xs="12" sm="6" md="4" lg="3" xl="2p" key={image.get('_id')}>
              <Card
                onClick={() => onSelectImage(image)}
                inverse
                role="presentation"
                color={ selectedImages.some((i) => `${i.get('_id')}` === `${image.get('_id')}`) ? 'success' : '' }
                className={classNames('shadow', 'p-2', 'image-grid-card')}
                style={{ cursor: 'pointer' }}
              >
                <Media className="aspect-ratio aspect-ratio-1by1 mt-0">
                  <BackgroundImage
                    imgSrc={damUrl(image, '1by1', 'sm')}
                    alt="thumbnail"
                  />
                  <CardImgOverlay>
                    <CardTitle className="h5 mb-0">{image.get('title')}</CardTitle>
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
