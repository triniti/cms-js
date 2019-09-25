import React from 'react';
import PropTypes from 'prop-types';

import { Field } from 'redux-form';
import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';
import Message from '@gdbots/pbj/Message';
import DatePickerField from '@triniti/cms/components/date-picker-field';
import TextField from '@triniti/cms/components/text-field';
import TextareaField from '@triniti/cms/components/textarea-field';
import SelectField from '@triniti/cms/components/select-field';
import CheckboxField from '@triniti/cms/components/checkbox-field';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field';

import { fieldRules } from '../../constants';

const { DESCRIPTION_MAX_CHARACTERS } = fieldRules;

const removeNewline = (value) => value && value.replace('\n', '');

const SeoFields = ({ areLinkedImagesAllowed, isEditMode, node }) => (
  <Card>
    <CardHeader>SEO</CardHeader>
    <CardBody indent>
      <Field name="seoTitle" component={TextField} label="Seo Title Tag" readOnly={!isEditMode} />
      <Field
        name="metaDescription"
        component={TextareaField}
        label="Meta Description"
        readOnly={!isEditMode}
        maxLength={DESCRIPTION_MAX_CHARACTERS}
        normalize={removeNewline}
      />
      <Field
        disabled={!isEditMode}
        name="metaKeywords"
        component={SelectField}
        label="Meta Keywords"
        multi
        creatable
        noResultsText="Add a keyword"
        promptTextCreator={(label) => `Add keyword "${label}"`}
        placeholder="Type to enter keywords..."
      />
      <Field
        areLinkedImagesAllowed={areLinkedImagesAllowed}
        name="seoImageRef"
        component={ImageAssetPickerField}
        isEditMode={isEditMode}
        node={node}
        label="SEO Image"
      />
      <Field
        component={DatePickerField}
        label="SEO Published At"
        name="seoPublishedAt"
        readOnly={!isEditMode}
      />
      <hr />
      <Field name="isUnlisted" component={CheckboxField} label="Unlisted" disabled={!isEditMode} />
    </CardBody>
  </Card>
);

SeoFields.propTypes = {
  areLinkedImagesAllowed: PropTypes.bool,
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message),
};

SeoFields.defaultProps = {
  areLinkedImagesAllowed: true,
  isEditMode: true,
  node: null,
};

export default SeoFields;
