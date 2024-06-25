import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { DatePickerField, SwitchField, TextareaField, TextField } from '@triniti/cms/components/index.js';
import AdvertisingFields from '@triniti/cms/plugins/common/components/advertising-fields/index.js';
import ImagePickerField from '@triniti/cms/plugins/dam/components/image-picker-field/index.js';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';
import SlugField from '@triniti/cms/plugins/ncr/components/slug-field/index.js';
import SponsorPickerField from '@triniti/cms/plugins/boost/components/sponsor-picker-field/index.js';
import TaggableFields from '@triniti/cms/plugins/common/components/taggable-fields/index.js';
import TimelinePickerField from '@triniti/cms/plugins/curator/components/timeline-picker-field/index.js';

export default function DetailsTab(props) {
  const { node, nodeRef } = props;
  const schema = node.schema();

  return (
    <>
      <Card>
        <CardHeader>Details</CardHeader>
        <CardBody>
          <TextField name="title" label="Title" required />
          <TextField name="display_title" label="Display Title" />
          <SlugField nodeRef={nodeRef} />

          {schema.hasMixin('triniti:curator:mixin:teaserable') && (
            <DatePickerField name="order_date" label="Order Date" />
          )}

          {schema.hasMixin('gdbots:ncr:mixin:expirable') && (
            <DatePickerField name="expires_at" label="Expires At" />
          )}

          <ImagePickerField name="image_ref" label="Image" nodeRef={nodeRef} />
          <TextareaField name="description" label="Description" rows={3} />

          {schema.hasMixin('triniti:boost:mixin:sponsorable') && (
            <SponsorPickerField name="sponsor_ref" label="Sponsor" />
          )}

          {schema.hasMixin('triniti:common:mixin:themeable') && (
            <PicklistField picklist="timeline-themes" name="theme" label="Theme" />
          )}

          <TimelinePickerField name="related_timeline_refs" label="Related Timelines" isMulti />
          <SwitchField name="allow_comments" label="Allow Comments" />
        </CardBody>
      </Card>

      <AdvertisingFields />
      <TaggableFields />
    </>
  );
}
