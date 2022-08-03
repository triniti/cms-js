import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import SlugField from 'plugins/ncr/components/slug-field';
import { DatePickerField, SelectField, SwitchField, TextareaField, TextField } from 'components';
import AdvertisingFields from 'plugins/common/components/advertising-fields';
import ImagePickerField from 'plugins/dam/components/image-picker-field';
import TaggableFields from 'plugins/common/components/taggable-fields';
import PicklistField from 'plugins/sys/components/picklist-field';

export default function DetailsTab(props) {
  const { nodeRef, node } = props;
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
            <DatePickerField name="expires_At" label="Expires At" />
          )}

          <TextareaField name="description" label="Description" placeholder="enter description" />
          <ImagePickerField name="image_ref" label="Primary Image" nodeRef={nodeRef} />
          <TextField name="launchText" label="Launch Text" placeholder="enter launch text" />

          <PicklistField picklist="video-swipes" name="swipe" label="Swipe" />
        </CardBody>
      </Card>
      <Card>
        <CardHeader>Related Videos</CardHeader>
        <CardBody>
          <SwitchField name="show_related_videos" label="Show Related Videos" />
          <TextField name="related_videos_heading" label="Related Videos Heading" />
        </CardBody>
      </Card>
      {schema.hasMixin('triniti:curator:mixin:has-related-teasers') && (
        <Card>
          <CardHeader>Related Teasers</CardHeader>
          <CardBody>
            <TextField name="related_teasers_heading" label="Related Teasers Heading" />
          </CardBody>
        </Card>
      )}
      <AdvertisingFields />
      <TaggableFields />
    </>
  );
}
