import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { SelectField, SwitchField, TextareaField, TextField, UrlField } from '@triniti/cms/components/index.js';
import BlocksmithField from '@triniti/cms/components/blocksmith-field/index.js';
import AdvertisingFields from '@triniti/cms/plugins/common/components/advertising-fields/index.js';
import TaggableFields from '@triniti/cms/plugins/common/components/taggable-fields/index.js';
import AssetPickerField from '@triniti/cms/plugins/dam/components/asset-picker-field/index.js';
import SlugField from '@triniti/cms/plugins/ncr/components/slug-field/index.js';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';
import HashtagPickerField from '@triniti/cms/plugins/taxonomy/components/hashtag-picker-field/index.js';

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
          <AssetPickerField name="image_ref" label="Image" nodeRef={nodeRef} />
          <SelectField name="bio_source" label="Bio Source" options={bioSourceOptions} />
          <TextareaField name="bio" label="Bio" rows={6} maxCharsConfig={{charsMax: 300, charsWarning: 150}} parse={value => value && value.replace('\n', '')} />
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
          <BlocksmithField name="blocks" />
        </CardBody>
      </Card>
      <AdvertisingFields />
      <TaggableFields />
    </>
  );
}
