import React, { lazy, Suspense } from 'react';
import startCase from 'lodash-es/startCase.js';
import { Card, CardBody, CardHeader } from 'reactstrap';
import {
  DatePickerField,
  ErrorBoundary,
  KeyValuesField,
  Loading,
  NumberField,
  SwitchField,
  TextareaField,
  TextField,
  UrlField
} from '@triniti/cms/components/index.js';
import SponsorPickerField from '@triniti/cms/plugins/boost/components/sponsor-picker-field/index.js';
import TimelinePickerField from '@triniti/cms/plugins/curator/components/timeline-picker-field/index.js';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field/index.js';
import AdvertisingFields from '@triniti/cms/plugins/common/components/advertising-fields/index.js';
import TaggableFields from '@triniti/cms/plugins/common/components/taggable-fields/index.js';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';
import slottingKeys from '@triniti/app/config/slottingKeys.js';

const components = {};
const resolveComponent = (label) => {
  if (components[label]) {
    return components[label];
  }

  const file = startCase(label).replace(/\s/g, '');
  components[label] = lazy(() => import(`@triniti/cms/plugins/curator/components/teaser-screen/${file}Fields.js`));
  return components[label];
};

export default function DetailsTab(props) {
  const { label, node } = props;
  const FieldsComponent = resolveComponent(label);
  const schema = node.schema();

  return (
    <>
      <Card>
        <CardHeader>Details</CardHeader>
        <CardBody className="pb-0">
          <TextField name="title" label="Title" required />

          <Suspense fallback={<Loading />}>
            <ErrorBoundary>
              <FieldsComponent {...props} />
            </ErrorBoundary>
          </Suspense>

          {schema.hasMixin('triniti:curator:mixin:teaser-has-target') && (
            <SwitchField name="sync_with_target" label="Sync With Target" />
          )}

          <DatePickerField name="order_date" label="Order Date" />

          {schema.hasMixin('gdbots:ncr:mixin:expirable') && (
            <DatePickerField name="expires_at" label="Expires At" />
          )}

          <ImageAssetPickerField name="image_ref" label="Primary Image" />

          {schema.hasMixin('triniti:common:mixin:swipeable') && (
            <PicklistField picklist="teaser-swipes" name="swipe" label="Swipe" />
          )}

          <TextField name="caption" label="Caption" />
          <PicklistField picklist="teaser-credits" name="credit" label="Credit" />
          <UrlField name="credit_url" label="Credit URL" />
          <TextField name="cta_text" label="Call To Action" />
          <TextareaField name="description" label="Description" rows={3} />
          <TimelinePickerField name="timeline_ref" label="Timeline" />

          {schema.hasMixin('triniti:boost:mixin:sponsorable') && (
            <SponsorPickerField name="sponsor_ref" label="Sponsor" />
          )}

          {schema.hasMixin('triniti:common:mixin:themeable') && (
            <PicklistField picklist="teaser-themes" name="theme" label="Theme" />
          )}

          <KeyValuesField
            name="slotting"
            label="Slotting"
            component={NumberField}
            selectKeyProps={{ options: slottingKeys }}
          />
        </CardBody>
      </Card>

      <AdvertisingFields />
      <TaggableFields />
    </>
  );
}
