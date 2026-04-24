import React, { useState } from 'react';
import { Card, CardImgOverlay, CardTitle, Col, Container, Media, Row } from 'reactstrap';
import { BackgroundImage, Icon } from '@triniti/cms/components/index.js';
import AssetIcon from '@triniti/cms/plugins/dam/components/asset-icon/index.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';

function AssetCard ({ node, batch, imagesPerRow, onSelectAsset }) {
  const [isHovering, setIsHovering] = useState(false);
  const id = node.get('_id');
  const key = `asset-${id.toString()}`;
  let previewUrl = null;
  if (node.has('image_ref')) {
    previewUrl = damUrl(node.get('image_ref'), 'o', 'sm');
  } else {
    const mimeType = `${node.get('mime_type', '')}`;
    if (mimeType.startsWith('image/')) {
      previewUrl = damUrl(node.get('_id'), 'o', 'sm');
    }
  }
  const selected = batch?.has?.(node);
  const title = node.get('title');

  const handleMouseLeave = () => setIsHovering(false);
  const handleMouseEnter = () => setIsHovering(true);

  const handleClick = () => {
    if (batch) {
      batch.toggle(node);
    } else if (onSelectAsset) {
      onSelectAsset(node.generateNodeRef());
    }
  };

  const Component = imagesPerRow ? 'div' : Col;
  const layout = imagesPerRow
    ? { style: { width: `calc(100% / ${imagesPerRow})` } }
    : { xs: 12, sm: 6, md: 4, lg: 3, xl: 2 };

  return (
    <Component key={key} id={key} {...layout}>
      <Card
        onBlur={handleMouseLeave}
        onFocus={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
        inverse
        className={`p-1 mb-0 image-grid-card cursor-pointer overflow-hidden ${selected ? 'selected focus-ring-box-shadow' : ''}`}
      >
        <Media
          className="ratio ratio-1x1 mt-0 mb-0 border border-4 bg-light"
          style={{ '--bs-border-color': 'var(--bs-body-bg)' }}
        >
          {previewUrl ? (
            <BackgroundImage imgSrc={previewUrl} alt="" className="background-image-contain background-image-no-repeat" />
          ) : (
            <div className="d-flex align-items-center justify-content-center w-100 h-100">
              <AssetIcon id={id} />
            </div>
          )}
          {(isHovering || selected) && (
            <div className="position-absolute w-100 h-100 bg-opacity-50 bg-black" />
          )}
        </Media>
        {title && (
          <CardImgOverlay>
            <CardTitle tag="h3" className={`${isHovering ? 'card-title--no-text-wrap ' : ''}h5 mb-0 text-start`}>{title}</CardTitle>
          </CardImgOverlay>
        )}
        <div className="position-absolute p-0 d-flex justify-content-end" style={{ top: '10px', right: '10px' }}>
          {isHovering && (
            <a
              href={nodeUrl(node, 'edit')}
              target="_blank"
              rel="noopener noreferrer"
              className="d-inline-block text-white opacity-75"
              onClick={(e) => e.stopPropagation()}
            >
              <Icon imgSrc="pencil" alt="edit" size="md" />
            </a>
          )}
        </div>
      </Card>
    </Component>
  );
}

export default function AssetCardGrid (props) {
  const { nodes, batch, onSelectAsset, imagesPerRow } = props;

  return (
    <Container fluid className="gallery-grid-container h-100">
      <Row className="m-0 g-2">
        {nodes.map(node => (
          <AssetCard
            key={`asset-${node.get('_id').toString()}`}
            node={node}
            batch={batch}
            onSelectAsset={onSelectAsset}
            imagesPerRow={imagesPerRow}
          />
        ))}
      </Row>
    </Container>
  );
}
