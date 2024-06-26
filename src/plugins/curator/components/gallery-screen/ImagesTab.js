import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';

export default function ImagesTab(props) {
  const { node, nodeRef } = props;
  const schema = node.schema();

  return (
    <>
      <Card>
        <CardHeader>Images</CardHeader>
        <CardBody>
          <p>soon</p>
        </CardBody>
      </Card>
    </>
  );
}
