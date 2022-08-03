import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { expand } from '@gdbots/pbjx/pbjUrl';

export default function RawPbj({ pbj }) {
  const schema = pbj.schema();
  const id = schema.getId();
  const url = expand('pbj.json-schema', {
    vendor: id.getVendor(),
    package: id.getPackage(),
    category: id.getCategory(),
    message: id.getMessage(),
    version: id.getVersion().toString(),
  });

  return (
    <Card>
      <CardHeader className="sticky-top">
        <a href={url} target="_blank" rel="noopener noreferrer">{id.toString()}</a>
      </CardHeader>
      <CardBody>
        <pre>{JSON.stringify(pbj, null, 2)}</pre>
      </CardBody>
    </Card>
  );
}
