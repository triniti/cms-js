import React from 'react';
import { FormText } from 'reactstrap';
import { FlatArrayField, UrlField, useFormContext } from '@triniti/cms/components/index.js';

const normalizeSeoAlternateUrl = value => `${value || ''}`.trim();

const getNormalizedUrls = (allValues, fieldName) => {
  const values = Array.isArray(allValues?.[fieldName]) ? allValues[fieldName] : [];
  return values
    .map(normalizeSeoAlternateUrl)
    .filter(Boolean)
    .map(value => value.toLowerCase());
};

const seoAlternateUrlValidator = (value, allValues, meta) => {
  const normalized = normalizeSeoAlternateUrl(value);
  if (!normalized) {
    return 'Required';
  }

  try {
    if (new URL(normalized).protocol !== 'https:') {
      return 'Must use https://.';
    }
  } catch {
    return 'Must be a valid URL.';
  }

  const baseName = meta?.name?.replace(/\[\d+]$/, '') || 'seo_alternate_urls';
  const duplicateCount = getNormalizedUrls(allValues, baseName)
    .filter(url => url === normalized.toLowerCase())
    .length;

  if (duplicateCount > 1) {
    return 'URLs must be unique.';
  }
  return undefined;
};

export default function SeoAlternateUrlsField(props) {
  const {
    name = 'seo_alternate_urls',
    label = 'Alternate URLs',
    description = 'Enter one full URL per row. URLs must start with https://.',
    ...rest
  } = props;
  const { pbj } = useFormContext();

  if (!pbj.schema().hasField(name)) {
    return null;
  }

  return (
    <>
      <FlatArrayField
        {...rest}
        name={name}
        label={label}
        component={UrlField}
        parse={normalizeSeoAlternateUrl}
        validator={seoAlternateUrlValidator}
      />
      <FormText color="dark" className="mt-n2 mb-3">
        {description}
      </FormText>
    </>
  );
}
