import React from 'react';
import { Card, CardBody, CardHeader, CardText } from 'reactstrap';
import { KeyValuesField, TextField } from '@triniti/cms/components/index.js';

export default function TaggableFields() {
  return (
    <Card>
      <CardHeader>Custom Configuration</CardHeader>
      <CardBody className="pb-0">
        <CardText>
          Tags, also known as key/value pairs, can hold configuration or be used to
          track references in other systems.<br />
          Use consistent and descriptive names,
          e.g. <code>facebook_user_id:123</code>, <code>my_custom_option:special_value</code>
        </CardText>
        <KeyValuesField name="tags" label="" component={TextField} />
      </CardBody>
    </Card>
  );
}
