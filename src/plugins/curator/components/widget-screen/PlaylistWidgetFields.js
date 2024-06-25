import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { SwitchField } from '@triniti/cms/components/index.js';

export default function PlaylistWidgetFields() {
  return (
    <Card>
      <CardHeader>Playlist Widget Configuration</CardHeader>
      <CardBody>
        <SwitchField name="autoplay" label="Autoplay" />
      </CardBody>
    </Card>
  );
}
