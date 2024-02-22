import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { DatePickerField, SelectField, SwitchField, TextField, TextareaField } from 'components';
import ImagePickerField from 'plugins/dam/components/image-picker-field';

export default function SeoTab(props) {
  const { nodeRef } = props;
  return (
    <Card>
      <CardHeader>Seo</CardHeader>
      <CardBody>
        <TextField name="seo_title" label="SEO Title Tag" />
        <TextareaField name="meta_description" label="Meta Description" maxCharsConfig={{charsMax: 500}} />
        <SelectField name="meta_keywords" label="Meta Keywords" allowOther isMulti={true} />
        <ImagePickerField name="seo_image_ref" label="Seo Image" nodeRef={nodeRef} />
        <DatePickerField name="seo_published_at" label="SEO Published At" />
        <SwitchField name="is_unlisted" label="Unlisted" />
      </CardBody>
    </Card>
  );
}
