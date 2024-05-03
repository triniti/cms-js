import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { DatePickerField, SelectField, SwitchField, TextareaField, TextField } from '@triniti/cms/components/index.js';
import AdvertisingFields from 'plugins/common/components/advertising-fields';
import GalleryPickerField from 'plugins/curator/components/gallery-picker-field';
import ImagePickerField from 'plugins/dam/components/image-picker-field';
import PicklistField from 'plugins/sys/components/picklist-field';
import SlugField from 'plugins/ncr/components/slug-field';
import SponsorPickerField from 'plugins/boost/components/sponsor-picker-field';
import TaggableFields from 'plugins/common/components/taggable-fields';

export default function DetailsTab(props) {
  const { node, nodeRef } = props;
  const schema = node.schema();

  return (
    <>
      <Card>
        <CardHeader>Details</CardHeader>
        <CardBody>
          <TextField name="title" label="Title" required />
          <SlugField nodeRef={nodeRef} />
          <DatePickerField name="order_date" label="Order Date" />
          <DatePickerField name="expires_at" label="Expires At" />
          <TextareaField name="description" label="Description" />
          <ImagePickerField name="image_ref" label="Primary Image" nodeRef={nodeRef} />
          <TextField name="launch_text" label="Launch Text" />
          <SelectField name="layout" label="Layout" />
          <SwitchField name="allow_comments" label="Allow Comments" />
          <GalleryPickerField name="related_gallery_refs" label="Related Galleries" isMulti sortable />
          {schema.hasMixin('triniti:boost:mixin:sponsorable') && (
            <SponsorPickerField name="sponsor_ref" label="Sponsor" />
          )}
          <TextField name="caption" label="Caption" />
          <PicklistField name="credit" label="Credit" picklist="gallery-credits" />
          <TextField name="credit_url" label="Credit URL" />
        </CardBody>
      </Card>
      <AdvertisingFields />
      <TaggableFields />
    </>
  );
}
