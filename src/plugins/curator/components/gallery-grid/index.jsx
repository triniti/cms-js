import classNames from 'classnames';
import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import React from 'react';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
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

const GalleryGrid = ({
  galleries,
  onSelectGallery,
  selectedGalleries,
}) => (
  <Container fluid className="gallery-grid-container">
    {
      !!galleries.length
      && (
      <Row gutter="sm" className="m-0">
        {
          galleries.map((gallery) => {
            const imgSrc = damUrl(gallery.get('image_ref'), 'o', 'xs');
            const isSelected = selectedGalleries.some((g) => (
              g.get('_id').toString() === gallery.get('_id').toString()
            ));

            return (
              <Col xs="12" sm="6" md="4" lg="3" xl="2p" key={gallery.get('_id')}>
                <Card
                  onClick={() => onSelectGallery(gallery)}
                  shadow
                  inverse
                  hoverBorder
                  className={classNames('p-2', { selected: isSelected })}
                >
                  <Media aspectRatio="1by1">
                    <BackgroundImage
                      imgSrc={imgSrc}
                      alt="thumbnail"
                    />
                    <CardImgOverlay>
                      <CardTitle className="h5 mb-0">{ gallery.get('title') }</CardTitle>
                    </CardImgOverlay>
                  </Media>
                </Card>
              </Col>
            );
          })
        }
      </Row>
      )
    }
  </Container>
);

GalleryGrid.propTypes = {
  galleries: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
  onSelectGallery: PropTypes.func,
  selectedGalleries: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
};

GalleryGrid.defaultProps = {
  galleries: [],
  onSelectGallery: noop,
  selectedGalleries: [],
};

export default GalleryGrid;
