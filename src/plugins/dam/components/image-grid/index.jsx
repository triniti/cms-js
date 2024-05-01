import React, { useState } from 'react';
import classNames from 'classnames';
import noop from 'lodash-es/noop';
import { BackgroundImage } from 'components';
import {
  ButtonToolbar,
  Card,
  CardImgOverlay,
  CardTitle,
  Col,
  Container,
  Media,
  Row,
} from 'reactstrap';
import damUrl from 'plugins/dam/damUrl';
import useFormContext from 'components/useFormContext';

const isGallery = (schema) => schema.indexOf('gallery') > -1;

const Image = (props) => {
  const {
    node,
    onSelectImage = noop,
    selectedImages = [],
    colProps = {
      xs: '12',
      sm: '6',
      md: '4',
      lg: '3',
      xl: '2p',
      // style: {
      //   cursor: 'pointer',
      // }
    },
    cardProps = {},
    toolBarButtonRender,
  } = props;

  const [ isHovering, setIsHovering ] = useState(false);
  const formContext = useFormContext();
  const { editMode } = formContext;

  return (
    <Col key={node.get('_id')} {...colProps}>
      <Card
        onClick={() => onSelectImage(node)}
        inverse
        role="presentation"
        color={ selectedImages.some((i) => `${i.get('_id')}` === `${node.get('_id')}`) ? 'success' : '' }
        className={classNames('shadow', 'p-1', 'image-grid-card')}
        onMouseOver={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false) }
        style={{cursor: "pointer"}}
        {...cardProps}
      >
        <Media className="aspect-ratio aspect-ratio-1by1 mt-0 border border-4" style={{"--bs-border-color": "var(--bs-body-bg)"}}>
          <BackgroundImage
            imgSrc={damUrl(isGallery(`${node.schema()}`) ? node.get('image_ref') : node, '1by1', 'sm')}
            alt="thumbnail"
          />
          {!!toolBarButtonRender && editMode && isHovering
            && (
              <ButtonToolbar style={{ position: 'absolute', right: '.5rem', top: '.5rem' }}>
                {toolBarButtonRender(node)}
              </ButtonToolbar>
            )}
          <CardImgOverlay>
            <CardTitle className="h5 mb-0">{node.get('title')}</CardTitle>
          </CardImgOverlay>
        </Media>
      </Card>
    </Col>
  );
};

const ImageGrid = (props) => {
  const { nodes } = props;

  return (
    <Container fluid className="gallery-grid-container h-100">
      <Row gutter="sm" className="m-0">
        {!!nodes.length && ( // hove effect of card
          <>
            {nodes.map((node) => (
              <Image
                key={`asset-node.${node.get('_id')}`}
                node={node}
                {...props}
              />
            ))}
          </>
        )}
      </Row>
    </Container>
  );
}

export default ImageGrid;
