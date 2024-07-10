import React from 'react';
import { Card, CardBody, CardHeader, CardText } from 'reactstrap';
import { DatePickerField, TextField } from '@triniti/cms/components/index.js';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';
import TaggableFields from '@triniti/cms/plugins/common/components/taggable-fields/index.js';
import WidgetPickerField from '@triniti/cms/plugins/curator/components/widget-picker-field/index.js';
import SortableSlots from '@triniti/cms/plugins/curator/components/promotion-screen/SortableSlots.js';

export default function DetailsTab(props) {
  const { node } = props;
  const schema = node.schema();

  return (
    <>
      <Card>
        <CardHeader>Details</CardHeader>
        <CardBody>
          <TextField name="title" label="Title" required />
          {schema.hasMixin('gdbots:ncr:mixin:expirable') && (
            <DatePickerField name="expires_at" label="Expires At" />
          )}
          <PicklistField picklist="promotion-slots" name="slot" label="Screen / Slot" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Widgets</CardHeader>
        <CardBody>
          <CardText>
            A single promotion can handle an entire screen of a website or application.
            Widgets are placed into slots using the
            new <a href="https://github.com/triniti/schemas/blob/master/schemas/triniti/curator/slot/latest.xml" rel="noopener noreferrer" target="_blank">slot</a> object
            which determines how the widget is loaded and where it renders.<br/><br/>
          </CardText>
          <SortableSlots />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Legacy Widgets (Deprecated)</CardHeader>
        <CardBody>
          <CardText className="pb-2">
            This legacy method renders all widgets into the matching slot in the order they are
            included here.  It is less efficient due to querying to find matching promotions
            multiple times within a screen.
          </CardText>
          <WidgetPickerField name="widget_refs" label="Widgets" isMulti sortable />
        </CardBody>
      </Card>

      <TaggableFields />
    </>
  );
}
