import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { SwitchField } from '@triniti/cms/components/index.js';

export default function CarouselWidgetFields() {
  return (
    <Card>
      <CardHeader>Carousel Widget Configuration</CardHeader>
      <CardBody>
        <SwitchField name="show_captions" label="Show Captions" />
        <SwitchField name="show_controls" label="Show Controls" />
        <SwitchField name="show_position_indicators" label="Show Position Indicators" />
      </CardBody>
    </Card>
  );
}
