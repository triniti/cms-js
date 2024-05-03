import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { DatePickerField, SwitchField, TextField, UrlField } from '@triniti/cms/components/index.js';
import ImagePickerField from 'plugins/dam/components/image-picker-field';
import SponsorPickerField from 'plugins/boost/components/sponsor-picker-field';
import TaggableFields from 'plugins/common/components/taggable-fields';
import SortableAnswers from "plugins/apollo/components/poll-screen/SortableAnswers";

export default function DetailsTab(props) {
  const { node, nodeRef } = props;
  const schema = node.schema();

  return (
    <>
      <Card>
        <CardHeader>Details</CardHeader>
        <CardBody>
          <TextField name="title" label="Title" required />
          <TextField name="question" label="Question" />
          <UrlField name="question_url" label="Question Link" />
          <SwitchField name="allow_multiple_responses" label="Multiple Responses" />
          <DatePickerField name="expires_at" label="Expires At" />
          <ImagePickerField name="image_ref" label="Image" nodeRef={nodeRef} />
          {schema.hasMixin('triniti:boost:mixin:sponsorable') && (
            <SponsorPickerField name="sponsor_ref" label="Sponsor" />
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Answers</CardHeader>
        <CardBody>
          <SortableAnswers name="answers" {...props} />
        </CardBody>
      </Card>

      <TaggableFields />
    </>
  );
}
