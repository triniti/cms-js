import { FormGroup, Label } from '@triniti/admin-ui-plugin/components';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field';
import PropTypes from 'prop-types';
import React from 'react';
import constants from './constants';
import schemas from './schemas';
import Option from './Option';
import './styles.scss';

const selectComponents = { Option };
const PeoplePickerField = ({ isEditMode, isMulti, label, placeholder, ...rest }) => (
  <FormGroup>
    <Label>{label}</Label>
    <NodePickerField
      {...rest}
      constants={constants}
      isDisabled={!isEditMode}
      isMulti={isMulti}
      placeholder={placeholder || 'Select related people...'}
      schemas={schemas}
      selectComponents={selectComponents}
    />
  </FormGroup>
);

PeoplePickerField.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  isMulti: PropTypes.bool,
  label: PropTypes.string,
  placeholder: PropTypes.string,
};

PeoplePickerField.defaultProps = {
  isMulti: true,
  label: 'People',
  placeholder: null,
};

export default PeoplePickerField;
