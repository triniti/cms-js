import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { expand } from '@gdbots/pbjx/pbjUrl.js';

export default function LinkedNodesCard(props) {
  const { node } = props;
  if (!node.has('linked_refs')) {
    return null;
  }

  return (
    <Card>
      <CardHeader>Linked Nodes</CardHeader>
      <CardBody>
        <ul className="list-group">
          {node.get('linked_refs').map((ref) => {
            const key = ref.toString();
            return (
              <li key={key} className="list-group-item">
                <a
                  href={expand('node.view', { label: ref.getLabel(), _id: ref.getId() })}
                  target="_blank"
                  rel="noopener noreferrer">
                  {key}
                </a>
              </li>
            );
          })}
        </ul>
      </CardBody>
    </Card>
  );
}
