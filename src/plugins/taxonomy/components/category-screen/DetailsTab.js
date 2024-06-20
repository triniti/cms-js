import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { TextareaField, TextField } from '@triniti/cms/components/index.js';
import SponsorPickerField from '@triniti/cms/plugins/boost/components/sponsor-picker-field/index.js';
import AdvertisingFields from '@triniti/cms/plugins/common/components/advertising-fields/index.js';
import TaggableFields from '@triniti/cms/plugins/common/components/taggable-fields/index.js';
import ImagePickerField from '@triniti/cms/plugins/dam/components/image-picker-field/index.js';
import SlugField from '@triniti/cms/plugins/ncr/components/slug-field/index.js';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';
import HashtagPickerField from '@triniti/cms/plugins/taxonomy/components/hashtag-picker-field/index.js';

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
          <TextareaField name="description" label="Description" />
          <ImagePickerField name="image_ref" label="Image" nodeRef={nodeRef} />
          {schema.hasMixin('triniti:common:mixin:themeable') && (
            <PicklistField picklist="category-themes" name="theme" label="Theme" />
          )}
          {schema.hasMixin('triniti:taxonomy:mixin:hashtaggable') && (
            <HashtagPickerField name="hashtags" label="Hashtags" />
          )}
          {schema.hasMixin('triniti:boost:mixin:sponsorable') && (
            <SponsorPickerField name="sponsor_ref" label="Sponsor" />
          )}
        </CardBody>
      </Card>
      <AdvertisingFields />
      <TaggableFields />
    </>
  );
}
