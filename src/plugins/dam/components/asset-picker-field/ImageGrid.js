import React from 'react';
import {
  Card,
  Col,
  Container,
  Media,
  Row,
  UncontrolledTooltip,
} from 'reactstrap';
import { BackgroundImage } from '@triniti/cms/components/index.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';

export default function ImageGrid(props) {
  const { nodes, onSelectAsset } = props;

  return (
    <Container fluid className="gallery-grid-container h-100">
      <Row className="m-0 g-2">
        {nodes.map(node => {
          const id = node.get('_id');
          const key = `image-${id.toString()}`;
          const nodeRef = node.generateNodeRef();
          const previewUrl = damUrl(id, '1by1', 'sm');
          return (
            <Col key={key} id={key} xs={12} sm={6} md={4} lg={3} xl="2p">
              <Card
                onClick={() => onSelectAsset(nodeRef)}
                inverse
                tag="button"
                className="p-1 mb-0 image-grid-card cursor-pointer"
              >
                <Media className="ratio ratio-1x1 mt-0 mb-0 border border-4 bg-dark"
                       style={{ '--bs-border-color': 'var(--bs-body-bg)' }}>
                  <BackgroundImage imgSrc={previewUrl} alt="" />
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
