import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { DatePickerField, SwitchField, TextField, UrlField } from '@triniti/cms/components/index.js';
import SeoTitleField from '@triniti/cms/plugins/common/components/seo-title-field/index.js';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field/index.js';
import SponsorPickerField from '@triniti/cms/plugins/boost/components/sponsor-picker-field/index.js';
import TaggableFields from '@triniti/cms/plugins/common/components/taggable-fields/index.js';
import SortableAnswers from '@triniti/cms/plugins/apollo/components/poll-screen/SortableAnswers.js';

export default function DetailsTab(props) {
  const { node } = props;
  const schema = node.schema();

  return (
    <>
      <Card>
        <CardHeader>Details</CardHeader>
        <CardBody>
          <SeoTitleField />
          <TextField name="question" label="Question" />
          <UrlField name="question_url" label="Question URL" />
          <SwitchField name="allow_multiple_responses" label="Allow Multiple Responses" />

          {schema.hasMixin('triniti:curator:mixin:teaserable') && (
            <DatePickerField name="order_date" label="Order Date" />
          )}

          {schema.hasMixin('gdbots:ncr:mixin:expirable') && (
            <DatePickerField name="expires_at" label="Expires At" />
          )}

          <ImageAssetPickerField name="image_ref" label="Primary Image" />

          {schema.hasMixin('triniti:boost:mixin:sponsorable') && (
            <SponsorPickerField name="sponsor_ref" label="Sponsor" />
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Answers</CardHeader>
        <CardBody>
          <SortableAnswers />
        </CardBody>
      </Card>

      <TaggableFields />
    </>
  );
}
