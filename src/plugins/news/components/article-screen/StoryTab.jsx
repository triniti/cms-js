import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import SlugField from '@triniti/cms/plugins/ncr/components/slug-field';
import BlocksmithField from '@triniti/cms/components/blocksmith-field';
import { DatePickerField, KeyValuesField, NumberField, TextField } from '@triniti/cms/components';

export default function StoryTab(props) {
  const { nodeRef, node } = props;
  const schema = node.schema();

  return (
    <>
      <Card>
        <CardHeader>Story</CardHeader>
        <CardBody>
          <TextField name="title" label="Title" required />
          <SlugField nodeRef={nodeRef} withDatedSlug />
          {schema.hasMixin('triniti:curator:mixin:teaserable') && (
            <DatePickerField name="order_date" label="Order Date" />
          )}
          {schema.hasMixin('gdbots:ncr:mixin:expirable') && (
            <DatePickerField name="expires_At" label="Expires At" />
          )}
          <KeyValuesField name="slotting" label="Slotting" component={NumberField} />
        </CardBody>
      </Card>
      <Card>
        <CardHeader>Content</CardHeader>
        <CardBody>
          <BlocksmithField node={node} />
        </CardBody>
      </Card>
    </>
  );
}
