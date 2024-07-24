import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import SortableImage from '@triniti/cms/plugins/curator/components/gallery-screen/SortableImage.js';

export default function SortableImages(props) {
  const { nodes, batch } = props;

  return (
    <div className="p-3"  style={{ minHeight: '152px' }}>
      <Row className="m-0 g-2">
        {nodes.map(node => {
          return (
            <div key={`${node.get('_id')}`} style={{ width: '120px' }}>
              <SortableImage node={node} batch={batch} />
            </div>
          );
        })}
      </Row>
    </div>
  );
}
