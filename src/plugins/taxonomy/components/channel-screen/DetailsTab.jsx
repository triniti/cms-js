import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { TextareaField, TextField } from '@triniti/cms/components';
import SponsorPickerField from '@triniti/cms/plugins/boost/components/sponsor-picker-field';
import AdvertisingFields from '@triniti/cms/plugins/common/components/advertising-fields';
import TaggableFields from '@triniti/cms/plugins/common/components/taggable-fields';
import ImagePickerField from '@triniti/cms/plugins/dam/components/image-picker-field';
import SlugField from '@triniti/cms/plugins/ncr/components/slug-field';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field';
import HashtagPickerField from '@triniti/cms/plugins/taxonomy/components/hashtag-picker-field';

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
