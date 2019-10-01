import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import classNames from 'classnames';
import Message from '@gdbots/pbj/Message';
import {
  BackgroundImage,
  Card,
  CardImgOverlay,
  CardTitle,
  Col,
  Container,
  Media,
  Row,
} from '@triniti/admin-ui-plugin/components';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';

const ImageGrid = ({
  images,
  onSelectImage,
  selectedImages,
}) => (
  <Container fluid className="gallery-grid-container">
    <Row gutter="sm" className="m-0">
      {
        !!images.length
        && images.map((image) => (
          <Col xs="12" sm="6" md="4" lg="3" xl="2p" key={image.get('_id')}>
            <Card
              onClick={() => onSelectImage(image)}
              shadow
              inverse
              hoverBorder
              role="presentation"
              className={classNames('p-2', { selected: selectedImages.some((i) => i.get('_id').toString() === image.get('_id').toString()) })}
            >
              <Media aspectRatio="1by1" className="mt-0">
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
        ))
      }
    </Row>
  </Container>
);

ImageGrid.propTypes = {
  images: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
  onSelectImage: PropTypes.func,
  selectedImages: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
};

ImageGrid.defaultProps = {
  images: [],
  onSelectImage: noop,
  selectedImages: [],
};

export default ImageGrid;
