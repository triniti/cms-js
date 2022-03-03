import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';
import { Field } from 'redux-form';
import CheckboxField from '@triniti/cms/components/checkbox-field';
import DatePickerField from '@triniti/cms/components/date-picker-field';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import SelectField from '@triniti/cms/components/select-field';
import TextField from '@triniti/cms/components/text-field';
import MetaDescriptionField from './MetaDescriptionField';
import { fieldRules } from '../../constants';

const { DESCRIPTION_MAX_CHARACTERS } = fieldRules;
const removeNewline = (value) => value && value.replace('\n', '');

const SeoFields = ({ areLinkedImagesAllowed, isEditMode, node }) => {
  const [inputValue, setInputValue] = useState('');
  const handleMetaKeywordsInputChange = (text, input) => {
    if (text[text.length - 1] !== ',') {
      setInputValue(text);
    } else {
      // if user enters a comma, treat that as selecting their entry (like tab/enter)
      input.onChange([
        ...input.value,
        {
          label: text.slice(0, text.length - 1),
          value: text.slice(0, text.length - 1),
        },
      ]);
      setInputValue('');
    }
  };
  return (
    <Card>
      <CardHeader>SEO</CardHeader>
      <CardBody indent>
        <Field name="seoTitle" component={TextField} label="Seo Title Tag" readOnly={!isEditMode} />
        <Field
          name="metaDescription"
          component={MetaDescriptionField}
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
          inputValue={inputValue}
          isMulti
          creatable
          onInputChange={handleMetaKeywordsInputChange}
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
          title="Select SEO Image"
        />
        <Field
          className="seo-published-at"
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
};

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
