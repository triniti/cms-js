import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { DatePickerField, SelectField, SwitchField, TextField, TextareaField } from '@triniti/cms/components/index.js';
import ImagePickerField from '@triniti/cms/plugins/dam/components/image-picker-field/index.js';

export default function SeoTab(props) {
  const { nodeRef } = props;
  return (
    <Card>
      <CardHeader>SEO</CardHeader>
      <CardBody>
        <TextField name="seo_title" label="SEO Title Tag" />
        <TextareaField name="meta_description" label="Meta Description" maxCharsConfig={{charsMax: 500}} parse={value => value && value.replace('\n', '')} />
        <SelectField name="meta_keywords" label="Meta Keywords" allowOther isMulti />
        <ImagePickerField name="seo_image_ref" label="SEO Image" nodeRef={nodeRef} />
        <DatePickerField name="seo_published_at" label="SEO Published At" />
        <SwitchField name="is_unlisted" label="Unlisted" />
      </CardBody>
    </Card>
  );
}
