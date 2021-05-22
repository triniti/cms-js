import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';
import { Field } from 'redux-form';
import classNames from 'classnames';
import get from 'lodash/get';
import CheckboxField from '@triniti/cms/components/checkbox-field';
import DatePickerField from '@triniti/cms/components/date-picker-field';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import SelectField from '@triniti/cms/components/select-field';
import TextareaField from '@triniti/cms/components/textarea-field';
import TextField from '@triniti/cms/components/text-field';
import { fieldRules } from '../../constants';

const { DESCRIPTION_MAX_CHARACTERS } = fieldRules;
const removeNewline = (value) => value && value.replace('\n', '');

const SeoFields = ({ areLinkedImagesAllowed, isEditMode, node, formValues }) => {
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
  const metaDescriptionLength = get(formValues, 'metaDescription', '').length;
  let metaDescriptionStyle = 'text-info';
  if (metaDescriptionLength >= 160) {
    metaDescriptionStyle = 'text-danger';
  } else if (metaDescriptionLength >= 140) {
    metaDescriptionStyle = 'text-warning';
  }

  return (
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
        <small
          style={{ marginBottom: '1.55rem', marginTop: '-1.3rem' }}
          className={classNames('ml-1', 'form-text', metaDescriptionStyle)}
        >
          {DESCRIPTION_MAX_CHARACTERS - metaDescriptionLength} characters remaining.
        </small>
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
  formValues: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message),
};

SeoFields.defaultProps = {
  areLinkedImagesAllowed: true,
  formValues: null,
  isEditMode: true,
  node: null,
};

export default SeoFields;
