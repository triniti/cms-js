import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { DatePickerField, SelectField, SwitchField, TextareaField, TextField } from '@triniti/cms/components/index.js';
import AdvertisingFields from '@triniti/cms/plugins/common/components/advertising-fields/index.js';
import GalleryPickerField from '@triniti/cms/plugins/curator/components/gallery-picker-field/index.js';
import ImagePickerField from '@triniti/cms/plugins/dam/components/image-picker-field/index.js';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';
import SlugField from '@triniti/cms/plugins/ncr/components/slug-field/index.js';
import SponsorPickerField from '@triniti/cms/plugins/boost/components/sponsor-picker-field/index.js';
import TaggableFields from '@triniti/cms/plugins/common/components/taggable-fields/index.js';

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
