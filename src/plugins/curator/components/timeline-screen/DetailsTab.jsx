import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { DatePickerField, SwitchField, TextareaField, TextField } from 'components';
import AdvertisingFields from 'plugins/common/components/advertising-fields';
import ImagePickerField from 'plugins/dam/components/image-picker-field';
import PicklistField from 'plugins/sys/components/picklist-field';
import SlugField from 'plugins/ncr/components/slug-field';
import SponsorPickerField from 'plugins/boost/components/sponsor-picker-field';
import TaggableFields from 'plugins/common/components/taggable-fields';
import TimelinePickerField from 'plugins/curator/components/timeline-picker-field';

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
          <TextareaField name="description" label="Description" />
          <DatePickerField name="order_date" label="Order Date" />
          <DatePickerField name="expires_at" label="Expires At" />
          <ImagePickerField name="image_ref" label="Image" nodeRef={nodeRef} />
          {schema.hasMixin('triniti:boost:mixin:sponsorable') && (
            <SponsorPickerField name="sponsor_ref" label="Sponsor" />
          )}
        </CardBody>
      </Card>
      <Card>
        <CardHeader>Contents</CardHeader>
        <CardBody>
          <SwitchField name="allow_comments" label="Allow Comments" />
          {schema.hasMixin('triniti:common:mixin:themeable') && (
            <PicklistField picklist="timeline-themes" name="theme" label="Theme" />
          )}
          <TimelinePickerField name="related_timeline_refs" label="Related Timelines" isMulti />
        </CardBody>
      </Card>
      <AdvertisingFields />
      <TaggableFields />
    </>
  );
}
