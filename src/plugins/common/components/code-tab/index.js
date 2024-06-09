import React from 'react';
import { Card, CardBody, CardHeader, CardText } from 'reactstrap';
import { KeyValuesField, TextareaField } from '@triniti/cms/components/index.js';

export default function CodeTab() {
  return (
    <Card>
      <CardHeader>Code</CardHeader>
      <CardBody className="pb-0">
        <CardText>
          Code can be HTML, JavaScript, or CSS that is injected into
          a named insertion point, e.g. "html_head" or "footer".<br />
          <small className="text-info">The available insertion points depend on the template.</small>
        </CardText>
        <KeyValuesField name="custom_code" label="" component={TextareaField} rows={6} />
      </CardBody>
    </Card>
  );
}
