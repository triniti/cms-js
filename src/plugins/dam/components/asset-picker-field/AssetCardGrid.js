import React from 'react';
import { Card, Col, Container, Media, Row, UncontrolledTooltip } from 'reactstrap';
import { BackgroundImage } from '@triniti/cms/components/index.js';
import AssetIcon from '@triniti/cms/plugins/dam/components/asset-icon/index.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';

/**
 * Generic grid component for displaying assets (images, videos, documents, etc.)
 * Supports both single-select (onSelectAsset) and multi-select (batch) modes.
 * 
 * @param {Object} props
 * @param {Array} props.nodes - Array of asset nodes to display
 * @param {Object} props.batch - Optional batch object for multi-select (has/toggle methods)
 * @param {Function} props.onSelectAsset - Optional callback for single-select mode
 * @param {Function} props.onDoubleClick - Optional callback for double-click actions
 */
export default function AssetCardGrid(props) {
  const { nodes, batch, onSelectAsset, onDoubleClick } = props;

  const getPreviewUrl = (node) => {
    // Using explicit image_ref if present (common for videos, etc.
    if (node.has && node.has('image_ref')) {
      return damUrl(node.get('image_ref'), '1by1', 'sm');
    }

    // For image assets, using the asset ID directly
    const mimeType = `${node.get('mime_type', '')}`;
    if (mimeType.startsWith('image/')) {
      return damUrl(node.get('_id'), '1by1', 'sm');
    }

    // For non-image types without an image_ref, return null to render an icon
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
          
          const handleClick = () => {
            if (batch) {
              // Multi-select mode with batch
              batch.toggle(node);
            } else if (onSelectAsset) {
              // Single-select mode
              onSelectAsset(nodeRef);
            }
          };
          
          const handleDoubleClick = () => {
            if (onDoubleClick) {
              onDoubleClick(nodeRef);
            }
          };

          return (
            <Col key={key} id={key} xs={12} sm={6} md={4} lg={3} xl="2p">
              <Card
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
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
