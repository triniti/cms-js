import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';

export default function TetrisWidgetFields() {
  return (
    <Card>
      <CardHeader>Tetris Widget Configuration</CardHeader>
      <CardBody>
        <PicklistField picklist="tetris-widget-layouts" name="layout" label="Layout" />
      </CardBody>
    </Card>
  );
}
