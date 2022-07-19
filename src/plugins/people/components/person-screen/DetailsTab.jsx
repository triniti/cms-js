import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { SelectField, SwitchField, TextareaField, TextField, UrlField } from 'components';
import BlocksmithField from 'components/blocksmith-field';
import AdvertisingFields from 'plugins/common/components/advertising-fields';
import TaggableFields from 'plugins/common/components/taggable-fields';
import ImagePickerField from 'plugins/dam/components/image-picker-field';
import SlugField from 'plugins/ncr/components/slug-field';
import PicklistField from 'plugins/sys/components/picklist-field';
import HashtagPickerField from 'plugins/taxonomy/components/hashtag-picker-field';

const bioSourceOptions = [
  { value: 'imdb', label: 'imdb' },
  { value: 'freebase', label: 'freebase' },
  { value: 'custom', label: 'custom' },
];

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
          <ImagePickerField name="image_ref" label="Image" nodeRef={nodeRef} />
          <SelectField name="bio_source" label="Bio Source" options={bioSourceOptions} />
          <TextareaField name="bio" label="Bio" rows={6} />
          <SwitchField name="is_celebrity" label="Is Celebrity?" />
          <UrlField name="imdb_url" label="Imdb Url" />
          <TextField name="twitter_username" label="Twitter Username" />
          {schema.hasMixin('triniti:common:mixin:themeable') && (
            <PicklistField picklist="person-themes" name="theme" label="Theme" />
          )}
          {schema.hasMixin('triniti:taxonomy:mixin:hashtaggable') && (
            <HashtagPickerField name="hashtags" label="Hashtags" />
          )}
        </CardBody>
      </Card>
      <Card>
        <CardHeader>Content</CardHeader>
        <CardBody>
          <BlocksmithField node={node} />
        </CardBody>
      </Card>
      <AdvertisingFields />
      <TaggableFields />
    </>
  );
}
