import React from 'react';
import { Card, CardBody, CardHeader, CardText } from 'reactstrap';

export default function LinkedNodesCard(props) {
  const { node } = props;
  if (!node.has('linked_refs')) {
    return null;
  }

  return (
    <Card>
      <CardHeader>Linked Nodes</CardHeader>
      <CardBody>
        <CardText>Coming soon, unlinking from here.</CardText>
        {node.get('linked_refs').map((ref) => {
          const key = ref.toString();
          return (
            <p key={key}>{key}</p>
          )
        })}
      </CardBody>
    </Card>
  );
}
