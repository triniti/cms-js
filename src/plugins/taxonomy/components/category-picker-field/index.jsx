import { FormGroup, Label } from '@triniti/admin-ui-plugin/components';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field';
import PropTypes from 'prop-types';
import React from 'react';
import constants from './constants';
import schemas from './schemas';

const CategoryPickerField = ({ label, isEditMode, isMulti, placeholder, ...rest }) => (
  <FormGroup>
    <Label>{label}</Label>
    <NodePickerField
      {...rest}
      constants={constants}
      isDisabled={!isEditMode}
      isMulti={isMulti}
      placeholder={placeholder || isMulti ? 'Select categories...' : 'Select a category...'}
      schemas={schemas}
    />
  </FormGroup>
);

CategoryPickerField.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  isMulti: PropTypes.bool,
  label: PropTypes.string,
  placeholder: PropTypes.string,
};

CategoryPickerField.defaultProps = {
  label: 'Categories',
  isMulti: true,
  placeholder: null,
};

export default CategoryPickerField;
