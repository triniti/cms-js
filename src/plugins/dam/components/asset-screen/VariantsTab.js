import React from 'react';
import { Card, CardBody, CardHeader, Spinner } from 'reactstrap';

export default function VariantsTab(props) {
  return (
    <Card>
      <CardHeader>Variants</CardHeader>
      <CardBody>
        <p>
          Click an image you would like to replace or drag a new image over it.
        </p>
      </CardBody>
    </Card>
  );
}
