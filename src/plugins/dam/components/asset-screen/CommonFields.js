import React from 'react';
import { Card, CardBody, CardHeader, CardText } from 'reactstrap';
import { DatePickerField, TextareaField, TextField, UrlField } from '@triniti/cms/components/index.js';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';
import PollPickerField from '@triniti/cms/plugins/apollo/components/poll-picker-field/index.js';
import GalleryCard from '@triniti/cms/plugins/dam/components/asset-screen/GalleryCard.js';
import LinkedNodesCard from '@triniti/cms/plugins/dam/components/asset-screen/LinkedNodesCard.js';

export default function CommonFields(props) {
  const { label, node } = props;
  const schema = node.schema();

  return (
    <>
      <Card>
        <CardHeader>Details</CardHeader>
        <CardBody>
          <TextField name="title" label="Title" />
          <TextField name="display_title" label="Display Title" />
          {schema.hasMixin('gdbots:ncr:mixin:expirable') && (
            <DatePickerField name="expires_At" label="Expires At" />
          )}
          <TextareaField name="description" label="Description" rows={3} />
          <TextField name="alt_text" label="Alt Text" />
          <PicklistField name="credit" label="Credit" picklist={`${label}-credits`} />
          <UrlField name="credit_url" label="Credit URL" />
          <TextField name="cta_text" label="Call To Action" />
          <UrlField name="cta_url" label="Call To Action URL" />
        </CardBody>
      </Card>

      {schema.hasMixin('triniti:apollo:mixin:has-poll') && (
        <Card>
          <CardHeader>Poll</CardHeader>
          <CardBody>
            <CardText>For applications that support it, a poll can be shown along with the asset, giving
            the user the ability to cast their vote (e.g. Hot or Not).</CardText>
            <PollPickerField name="poll_ref" label="Poll" />
          </CardBody>
        </Card>
      )}

      {node.has('gallery_ref') && <GalleryCard {...props} />}
      {node.has('linked_refs') && <LinkedNodesCard {...props} />}
    </>
  );
}
