import React from 'react';
import { Card, CardBody, CardHeader, FormText } from 'reactstrap';
import { DatePickerField, FlatArrayField, SelectField, SwitchField, TextareaField, UrlField } from '@triniti/cms/components/index.js';
import SeoTitleField from '@triniti/cms/plugins/common/components/seo-title-field/index.js';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field/index.js';

const removeLinkBreaks = value => value && value.replace('\n', ' ');
const normalizeSeoAlternateUrl = value => `${value || ''}`.trim();

const seoAlternateUrlValidator = (value) => {
  const normalized = normalizeSeoAlternateUrl(value);
  if (!normalized) {
    return 'Required';
  }

  if (!normalized.startsWith('https://')) {
    return 'Must start with https://.';
  }

  return undefined;
};

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

export default function SeoTab(props) {
  const { node, showAlternateUrls = false } = props;
  const schema = node.schema();
  const showSeoAlternateUrls = showAlternateUrls && schema.hasField('seo_alternate_urls');

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
        {showSeoAlternateUrls && (
          <>
            <FlatArrayField
              name="seo_alternate_urls"
              label="Alternate URLs"
              component={UrlField}
              parse={normalizeSeoAlternateUrl}
              format={normalizeSeoAlternateUrl}
              validator={seoAlternateUrlValidator}
            />
            <FormText color="dark" className="mt-n2 mb-3">
              Enter one full URL per row. URLs must start with https://.
            </FormText>
          </>
        )}
        <ImageAssetPickerField name="seo_image_ref" label="SEO Image" />
        <DatePickerField name="seo_published_at" label="SEO Published At" />
        <SwitchField name="is_unlisted" label="Unlisted" />
      </CardBody>
    </Card>
  );
}
