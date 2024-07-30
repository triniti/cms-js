import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { DatePickerField, SelectField, SwitchField, TextareaField } from '@triniti/cms/components/index.js';
import SeoTitleField from '@triniti/cms/plugins/common/components/seo-title-field/index.js';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field/index.js';

export default function SeoTab() {
  return (
    <Card>
      <CardHeader>SEO</CardHeader>
      <CardBody>
        <SeoTitleField name="seo_title" label="SEO Title Tag" required={false} />
        <TextareaField name="meta_description" label="Meta Description" maxCharsConfig={{charsMax: 500}} parse={value => value && value.replace('\n', '')} />
        <SelectField name="meta_keywords" label="Meta Keywords" allowOther isMulti />
        <ImageAssetPickerField name="seo_image_ref" label="SEO Image" />
        <DatePickerField name="seo_published_at" label="SEO Published At" />
        <SwitchField name="is_unlisted" label="Unlisted" />
      </CardBody>
    </Card>
  );
}
