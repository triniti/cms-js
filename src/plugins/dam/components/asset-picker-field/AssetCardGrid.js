import React from 'react';
import { Card, CardImgOverlay, CardTitle, Col, Container, Media, Row } from 'reactstrap';
import { BackgroundImage } from '@triniti/cms/components/index.js';
import AssetIcon from '@triniti/cms/plugins/dam/components/asset-icon/index.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';

export default function AssetCardGrid (props) {
  const { nodes, batch, onSelectAsset } = props;

  const getPreviewUrl = (node) => {
    if (node.has && node.has('image_ref')) {
      return damUrl(node.get('image_ref'), '1by1', 'sm');
    }

    const mimeType = `${node.get('mime_type', '')}`;
    if (mimeType.startsWith('image/')) {
      return damUrl(node.get('_id'), '1by1', 'sm');
    }

    return null;
  };

  return (
    <Container fluid className="gallery-grid-container h-100">
      <Row className="m-0 g-2">
        {nodes.map((node) => {
          const id = node.get('_id');
          const key = `asset-${id.toString()}`;
          const nodeRef = node.generateNodeRef();
          const previewUrl = getPreviewUrl(node);
          const selected = batch?.has?.(node);
          const title = node.get('title');
          
          const handleClick = () => {
            if (batch) {
              batch.toggle(node);
            } else if (onSelectAsset) {
              onSelectAsset(nodeRef);
            }
          };

          return (
            <Col key={key} id={key} xs={12} sm={6} md={4} lg={3}>
              <Card
                onClick={handleClick}
                inverse
                tag="button"
                className={`p-1 mb-0 image-grid-card cursor-pointer ${selected ? 'selected' : ''}`}
              >
                <Media className="ratio ratio-1x1 mt-0 mb-0 border border-4 bg-dark" 
                       style={{ '--bs-border-color': 'var(--bs-body-bg)' }}>
                  {previewUrl ? (
                    <BackgroundImage imgSrc={previewUrl} alt="" />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center w-100 h-100">
                      <AssetIcon id={id} />
                    </div>
                  )}
                  {title && (
                    <CardImgOverlay>
                      <CardTitle tag="h3" className="h5 mb-0 text-start">{title}</CardTitle>
                    </CardImgOverlay>
                  )}
                </Media>
              </Card>
              <UncontrolledTooltip target={key} placement="bottom">
                {title}
              </UncontrolledTooltip>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
