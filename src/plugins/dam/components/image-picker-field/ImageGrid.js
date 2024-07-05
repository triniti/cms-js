import React from 'react';
import classNames from 'classnames';
import {
  Card,
  CardImgOverlay,
  CardTitle,
  Col,
  Container,
  Media,
  Row,
} from 'reactstrap';
import { BackgroundImage } from '@triniti/cms/components/index.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';

export default function ImageGrid(props) {
  const { nodes, onSelectImage } = props;

  return (
    <Container fluid className="gallery-grid-container h-100">
      <Row gutter="sm" className="m-0">
        {nodes.map(node => {
          const nodeRef = node.generateNodeRef();
          const previewUrl = damUrl(node.get('_id'), '1by1', 'sm');
          return (
            <Col key={nodeRef.getId()} xs={12} sm={6} md={4} lg={3} xl="2p">
              <Card
                onClick={() => onSelectImage(nodeRef)}
                inverse
                role="button"
                className={classNames('shadow', 'p-1', 'image-grid-card')}
                style={{ cursor: 'pointer' }}
              >
                <Media className="ratio ratio-1x1 mt-0 border border-4 hover-box-shadow"
                       style={{ '--bs-border-color': 'var(--bs-body-bg)' }}>
                  <BackgroundImage imgSrc={previewUrl} alt="thumbnail" />
                  <CardImgOverlay>
                    <CardTitle className="h5 mb-0">{node.get('title')}</CardTitle>
                  </CardImgOverlay>
                </Media>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
