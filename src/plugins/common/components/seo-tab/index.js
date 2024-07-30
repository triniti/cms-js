import React from 'react';
import { Card, CardBody, CardHeader, FormText } from 'reactstrap';
import { DatePickerField, SelectField, SwitchField, TextareaField } from '@triniti/cms/components/index.js';
import SeoTitleField from '@triniti/cms/plugins/common/components/seo-title-field/index.js';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field/index.js';

const removeLinkBreaks = value => value && value.replace('\n', ' ');

function DescriptionWarning(props) {
  const { value } = props;
  if (!value) {
    return null;
  }

  const length = `${value || ''}`.length;
  if (length < 150) {
    return null;
  }

  return (
    <FormText color={length > 160 ? 'danger' : 'warning'} className="d-block">
      Use less than 160 characters to avoid getting truncated in search results.
      ({length}/160)
    </FormText>
  );
}

export default function SeoTab() {
  return (
    <Card>
      <CardHeader>SEO</CardHeader>
      <CardBody>
        <SeoTitleField name="seo_title" label="SEO Title Tag" required={false} />
        <TextareaField
          name="meta_description"
          label="Meta Description"
          maxLength={500}
          rows={3}
          parse={removeLinkBreaks}
          Warning={DescriptionWarning}
        />
        <SelectField name="meta_keywords" label="Meta Keywords" allowOther isMulti />
        <ImageAssetPickerField name="seo_image_ref" label="SEO Image" />
        <DatePickerField name="seo_published_at" label="SEO Published At" />
        <SwitchField name="is_unlisted" label="Unlisted" />
      </CardBody>
    </Card>
  );
}
