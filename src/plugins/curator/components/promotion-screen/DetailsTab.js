import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { DatePickerField, TextField } from '@triniti/cms/components/index.js';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';
import TaggableFields from '@triniti/cms/plugins/common/components/taggable-fields/index.js';
import WidgetPickerField from '@triniti/cms/plugins/curator/components/widget-picker-field/index.js';
import SortableSlots from '@triniti/cms/plugins/curator/components/promotion-screen/SortableSlots.js';

export default function DetailsTab(props) {
  return (
    <>
      <Card>
        <CardHeader>Details</CardHeader>
        <CardBody>
          <TextField name="title" label="Title" required />
          <DatePickerField name="expires_at" label="Expires At" />
          <PicklistField picklist="promotion-slots" name="slot" label="Slot" />
        </CardBody>
      </Card>
      <Card>
        <CardHeader>Slots</CardHeader>
        <CardBody>
          <SortableSlots name="slots" {...props} />
        </CardBody>
      </Card>
      <Card>
        <CardHeader>Widgets (Deprecated)</CardHeader>
        <CardBody>
          <WidgetPickerField name="widget_refs" label="Widgets" isMulti sortable />
        </CardBody>
      </Card>
      <TaggableFields />
    </>
  );
}