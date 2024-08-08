import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import PersonPickerField from '@triniti/cms/plugins/people/components/person-picker-field/index.js';
import CategoryPickerField from '@triniti/cms/plugins/taxonomy/components/category-picker-field/index.js';
import ChannelPickerField from '@triniti/cms/plugins/taxonomy/components/channel-picker-field/index.js';
import HashtagPickerField from '@triniti/cms/plugins/taxonomy/components/hashtag-picker-field/index.js';

export default function TaxonomyTab(props) {
  const { node } = props;
  const schema = node.schema();

  return (
    <Card>
      <CardHeader>Taxonomy</CardHeader>
      <CardBody>
        {schema.hasMixin('triniti:people:mixin:has-people') && (
          <>
            <PersonPickerField name="primary_person_refs" label="Primary People" isMulti />
            <PersonPickerField name="person_refs" label="People" isMulti />
          </>
        )}

        {schema.hasMixin('triniti:taxonomy:mixin:has-channel') && (
          <ChannelPickerField name="channel_ref" label="Channel" />
        )}

        {schema.hasMixin('triniti:taxonomy:mixin:categorizable') && (
          <CategoryPickerField name="category_refs" label="Categories" isMulti />
        )}

        {schema.hasMixin('triniti:taxonomy:mixin:hashtaggable') && (
          <HashtagPickerField name="hashtags" label="hashtags" />
        )}
      </CardBody>
    </Card>
  );
}
