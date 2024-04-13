import React from 'react';
import startCase from 'lodash-es/startCase';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { DatePickerField, EnumField, TextareaField, TextField } from '@triniti/cms/components';
import SlugField from '@triniti/cms/plugins/ncr/components/slug-field';
import SponsorType from '@triniti/schemas/triniti/boost/enums/SponsorType';
import TaggableFields from '@triniti/cms/plugins/common/components/taggable-fields';

export default function DetailsTab(props) {
  const { nodeRef } = props;

  return (
    <>
      <Card>
        <CardHeader>Details</CardHeader>
        <CardBody>
          <TextField name="title" label="Title" required />
          <SlugField nodeRef={nodeRef} />
          <DatePickerField name="expires_at" label="Expires At" />
          <EnumField
            enumClass={SponsorType}
            name="type"
            label="Sponsor Type"
          />
        </CardBody>
      </Card>
      <Card>
        <CardHeader>Code</CardHeader>
        <CardBody>
          <TextareaField name="permalink_html_head" label="Append To Html Head Tag" />
          <TextareaField name="permalink_badge" label="Permalink Badge" />
          <TextareaField name="timeline_badge" label="Timeline Badge" />
        </CardBody>
      </Card>
      <TaggableFields />
    </>
  );
}
