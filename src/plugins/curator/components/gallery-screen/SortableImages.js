import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import SortableImage from '@triniti/cms/plugins/curator/components/gallery-screen/SortableImage.js';

export default function SortableImages(props) {
  const { nodes, batch } = props;

  return (
    <Container fluid className="gallery-grid-container h-100">
      <Row className="m-0 g-2">
        {nodes.map(node => {
          return (
            <Col key={`${node.get('_id')}`} xs={12} sm={6} md={4} lg={3} xl="2p">
              <SortableImage node={node} batch={batch} />
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
