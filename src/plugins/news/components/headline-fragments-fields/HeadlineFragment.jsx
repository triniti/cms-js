import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import SelectField from '@triniti/cms/components/select-field';
import TextField from '@triniti/cms/components/text-field';
import { FormGroup } from '@triniti/admin-ui-plugin/components';
import { formRules } from '../../constants';
import './styles.scss';

const HeadlineFragment = ({ fields, isEditMode }) => (
  <FormGroup>
    {fields.map((field) => (
      <div key={field} className="d-flex">
        <Field name={`${field}.text`} component={TextField} readOnly={!isEditMode} className="flex-grow-1" />
        <Field
          className="ml-3 headline-fragment-style-select"
          clearable={false}
          component={SelectField}
          disabled={!isEditMode}
          name={`${field}.style`}
          options={formRules.HF_STYLES_OPTIONS}
          searchable={false}
        />
        <Field
          className="ml-3 headline-fragment-size-select"
          clearable={false}
          component={SelectField}
          disabled={!isEditMode}
          name={`${field}.size`}
          options={formRules.HF_SIZES_OPTIONS}
          searchable={false}
        />
      </div>
    ))}
  </FormGroup>
);

HeadlineFragment.propTypes = {
  fields: PropTypes.objectOf(PropTypes.any).isRequired,
  isEditMode: PropTypes.bool.isRequired,
};

export default HeadlineFragment;
