import React from 'react';
import { Row } from 'reactstrap';
import SortableImage from '@triniti/cms/plugins/curator/components/gallery-screen/SortableImage.js';

export default function SortableImages(props) {
  const { nodes, batch } = props;

  return (
    <div className="p-3"  style={{ minHeight: '152px' }}>
      <Row className="m-0 g-1">
        {nodes.map(node => {
          return (
            <div key={`${node.get('_id')}`} style={{ minWidth: '100px', width: 'calc(10% - 8px)' }} className="m-1">
              <SortableImage node={node} batch={batch} />
            </div>
          );
        })}
      </Row>
    </div>
  );
}
