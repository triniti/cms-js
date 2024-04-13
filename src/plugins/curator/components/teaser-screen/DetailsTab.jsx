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
} from '@triniti/cms/components';
import SponsorPickerField from '@triniti/cms/plugins/boost/components/sponsor-picker-field';
import TimelinePickerField from '@triniti/cms/plugins/curator/components/timeline-picker-field';
import ImagePickerField from '@triniti/cms/plugins/dam/components/image-picker-field';
import AdvertisingFields from '@triniti/cms/plugins/common/components/advertising-fields';
import TaggableFields from '@triniti/cms/plugins/common/components/taggable-fields';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field';

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

          <Suspense fallback={<Loading />}>
            <ErrorBoundary>
              <FieldsComponent {...props} />
            </ErrorBoundary>
          </Suspense>

          <DatePickerField name="order_date" label="Order Date" />
          {schema.hasMixin('gdbots:ncr:mixin:expirable') && (
            <DatePickerField name="expires_At" label="Expires At" />
          )}
          <ImagePickerField name="image_ref" label="Image" nodeRef={nodeRef} />
          {schema.hasMixin('triniti:boost:mixin:sponsorable') && (
            <SponsorPickerField name="sponsor_ref" label="Sponsor" />
          )}
          <TextField name="caption" label="Caption" />
          <PicklistField name="credit" label="Credit" picklist="teaser-credits" />
          <TextField name="credit_url" label="Credit URL" />
          <KeyValuesField name="slotting" label="Slotting" component={NumberField} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Contents</CardHeader>
        <CardBody>
          {node.has('sync_with_target') && (
            <CheckboxField name="sync_with_target" label="Sync With Target" />
          )}
          <PicklistField name="theme" label="Theme" picklist="teaser-themes" />
          <PicklistField name="swipe" label="Swipe" picklist="teaser-swipes" />
          <TextField name="cta_text" label="Call to Action Label" />
          <TextareaField name="description" label="Description" />
          <TimelinePickerField name="timeline_ref" label="Timeline" />
        </CardBody>
      </Card>

      <AdvertisingFields />
      <TaggableFields />
    </>
  );
}
