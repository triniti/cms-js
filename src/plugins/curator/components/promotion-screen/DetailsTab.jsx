import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { DatePickerField, TextField } from 'components';
import PicklistField from 'plugins/sys/components/picklist-field';
import TaggableFields from 'plugins/common/components/taggable-fields';
import WidgetPickerField from 'plugins/curator/components/widget-picker-field';
import SortableSlots from 'plugins/curator/components/promotion-screen/SortableSlots';

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
          <WidgetPickerField name="widget_refs" label="Widgets" isMulti />
        </CardBody>
      </Card>
      <TaggableFields />
    </>
  );
}
