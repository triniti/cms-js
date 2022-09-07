import React, { lazy, Suspense } from 'react';
import startCase from 'lodash-es/startCase';
import { Card, CardBody, CardHeader } from 'reactstrap';
import {
  CheckboxField,
  DatePickerField,
  ErrorBoundary,
  KeyValuesField,
  Loading,
  NumberField,
  TextareaField,
  TextField
} from 'components';
import SponsorPickerField from 'plugins/boost/components/sponsor-picker-field';
import TimelinePickerField from 'plugins/curator/components/timeline-picker-field';
import ImagePickerField from 'plugins/dam/components/image-picker-field';
import AdvertisingFields from 'plugins/common/components/advertising-fields';
import TaggableFields from 'plugins/common/components/taggable-fields';
import PicklistField from 'plugins/sys/components/picklist-field';

const components = {};
const resolveComponent = (label) => {
  if (components[label]) {
    return components[label];
  }

  const file = startCase(label).replace(/\s/g, '');
  components[label] = lazy(() => import(`./${file}Fields`));
  return components[label];
};

export default function DetailsTab(props) {
  const { label, node, nodeRef } = props;
  const FieldsComponent = resolveComponent(label);
  const schema = node.schema();

  return (
    <>
      <Card>
        <CardHeader>Details</CardHeader>
        <CardBody>
          <TextField name="title" label="Title" required />
        </CardBody>
      </Card>
      <TaggableFields />
    </>
  );
}
