import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { TextareaField } from '@triniti/cms/components/index.js';

export default function CodeTab() {
  return (
    <Card>
      <CardHeader>Code</CardHeader>
      <CardBody>
        <TextareaField name="pre_render_code" label="Pre Render Code" rows={10} />
        <TextareaField name="post_render_code" label="Post Render Code" rows={10} />
      </CardBody>
    </Card>
  );
}
