import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import SlugField from '@triniti/cms/plugins/ncr/components/slug-field/index.js';
import BlocksmithField from '@triniti/cms/components/blocksmith-field/index.js';
import { DatePickerField, KeyValuesField, NumberField, SwitchField, TextField } from '@triniti/cms/components/index.js';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';
import slottingKeys from '@triniti/app/config/slottingKeys.js';

export default function StoryTab(props) {
  const { nodeRef, node } = props;
  const schema = node.schema();

  return (
    <>
      <Card>
        <CardHeader>Story</CardHeader>
        <CardBody className="pb-0">
          <TextField name="title" label="Title" required />
          <SlugField nodeRef={nodeRef} withDatedSlug />
          {schema.hasMixin('triniti:curator:mixin:teaserable') && (
            <DatePickerField name="order_date" label="Order Date" />
          )}
          {schema.hasMixin('gdbots:ncr:mixin:expirable') && (
            <DatePickerField name="expires_At" label="Expires At" />
          )}
          <PicklistField picklist="article-classifications" name="classification" label="Classification" />
          <SwitchField name="is_homepage_news" label="Homepage News" />
          <KeyValuesField
            name="slotting"
            label="Slotting"
            component={NumberField}
            selectKeyProps={{ options: slottingKeys }}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Content</CardHeader>
        <CardBody>
          <BlocksmithField name="blocks" />
        </CardBody>
      </Card>
    </>
  );
}
