import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { DatePickerField, EnumField, TextareaField, TextField } from '@triniti/cms/components/index.js';
import SponsorType from '@triniti/schemas/triniti/boost/enums/SponsorType.js';
import SlugField from '@triniti/cms/plugins/ncr/components/slug-field/index.js';
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
          {schema.hasMixin('gdbots:ncr:mixin:expirable') && (
            <DatePickerField name="expires_at" label="Expires At" />
          )}
          <EnumField enumClass={SponsorType} name="type" label="Type" />
          <TextareaField name="permalink_html_head" label="Permalink HTML Head" rows={10} />
          <TextareaField name="permalink_badge" label="Permalink Badge" rows={10} />
          <TextareaField name="timeline_badge" label="Timeline Badge" rows={10} />
        </CardBody>
      </Card>

      <TaggableFields />
    </>
  );
}
