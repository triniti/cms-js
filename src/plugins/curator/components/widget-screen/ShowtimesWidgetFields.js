import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { SwitchField, TextareaField, TextField } from '@triniti/cms/components/index.js';
import ImagePickerField from '@triniti/cms/plugins/dam/components/image-picker-field/index.js';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';

export default function ShowtimesWidgetFields(props) {
  const { nodeRef } = props;

  return (
    <Card>
      <CardHeader>Showtimes Widget Configuration</CardHeader>
      <CardBody>
        <TextField name="headline" label="Headline" />
        <TextareaField name="excerpt" label="Excerpt" rows={2} />
        <ImagePickerField name="image_ref" label="Image" nodeRef={nodeRef} />
        <PicklistField name="show" label="Show" picklist="showtimes-widget-shows" />
        <SwitchField name="include_latest_episode" label="Include Latest Episode" />
        <SwitchField name="include_latest_promo" label="Include Latest Promo" />
      </CardBody>
    </Card>
  );
}
