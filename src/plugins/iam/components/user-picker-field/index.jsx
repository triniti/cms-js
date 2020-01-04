import { FormGroup, Label } from '@triniti/admin-ui-plugin/components';
import kebabCase from 'lodash/kebabCase';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field';
import PropTypes from 'prop-types';
import React from 'react';
import constants from './constants';
import schemas from './schemas';

const UserPickerField = ({ fields, label, isEditMode, placeholder, ...rest }) => (
  <FormGroup className={`user-picker-field user-picker-field-${kebabCase(fields.name)}`}>
    <Label>{label}</Label>
    <NodePickerField
      {...rest}
      constants={constants}
      fields={fields}
      isClearable
      isDisabled={!isEditMode}
      isMulti={false}
      placeholder={placeholder}
      schemas={schemas}
    />
  </FormGroup>
);

UserPickerField.propTypes = {
  fields: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  isEditMode: PropTypes.bool.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
};

UserPickerField.defaultProps = {
  label: 'User',
  placeholder: 'Select a user...',
};

export default UserPickerField;
