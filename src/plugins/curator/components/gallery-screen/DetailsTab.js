import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import {
  DatePickerField,
  SelectField,
  SwitchField,
  TextareaField,
  TextField,
  UrlField
} from '@triniti/cms/components/index.js';
import AdvertisingFields from '@triniti/cms/plugins/common/components/advertising-fields/index.js';
import ImagePickerField from '@triniti/cms/plugins/dam/components/image-picker-field/index.js';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';
import SlugField from '@triniti/cms/plugins/ncr/components/slug-field/index.js';
import GalleryPickerField from '@triniti/cms/plugins/curator/components/gallery-picker-field/index.js';
import SponsorPickerField from '@triniti/cms/plugins/boost/components/sponsor-picker-field/index.js';
import TaggableFields from '@triniti/cms/plugins/common/components/taggable-fields/index.js';
import galleryLayouts from '@triniti/app/config/galleryLayouts.js';

export default function DetailsTab(props) {
  const { node, nodeRef } = props;
  const schema = node.schema();

  return (
    <>
      <Card>
        <CardHeader>Details</CardHeader>
        <CardBody>
          <TextField name="title" label="Title" required />
          <SlugField nodeRef={nodeRef} withDatedSlug />

          {schema.hasMixin('triniti:curator:mixin:teaserable') && (
            <DatePickerField name="order_date" label="Order Date" />
          )}

          {schema.hasMixin('gdbots:ncr:mixin:expirable') && (
            <DatePickerField name="expires_at" label="Expires At" />
          )}

          <ImagePickerField name="image_ref" label="Image" nodeRef={nodeRef} />
          <TextareaField name="description" label="Description" rows={3} />
          <TextField name="launch_text" label="Launch Text" />
          <PicklistField name="credit" label="Credit" picklist="gallery-credits" />
          <UrlField name="credit_url" label="Credit URL" />
          <SelectField name="layout" label="Layout" options={galleryLayouts} />

          {schema.hasMixin('triniti:boost:mixin:sponsorable') && (
            <SponsorPickerField name="sponsor_ref" label="Sponsor" />
          )}

          {schema.hasMixin('triniti:common:mixin:themeable') && (
            <PicklistField picklist="gallery-themes" name="theme" label="Theme" />
          )}

          <SwitchField name="allow_comments" label="Allow Comments" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Related Galleries</CardHeader>
        <CardBody>
          <GalleryPickerField name="prev_gallery_ref" label="Previous Gallery" />
          <GalleryPickerField name="next_gallery_ref" label="Next Gallery" />
          <GalleryPickerField name="related_gallery_refs" label="Related Galleries" isMulti sortable />
        </CardBody>
      </Card>

      <AdvertisingFields />
      <TaggableFields />
    </>
  );
}
