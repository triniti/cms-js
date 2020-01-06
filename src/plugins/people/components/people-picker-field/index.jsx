import { FormGroup, Label } from '@triniti/admin-ui-plugin/components';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field';
import PropTypes from 'prop-types';
import React from 'react';
import constants from './constants';
import MultiValueLabel from './MultiValueLabel';
import Option from './Option';
import schemas from './schemas';
import './styles.scss';

const PeoplePickerField = ({ isEditMode, isMulti, label, placeholder, ...rest }) => (
  <FormGroup className="people-picker-field">
    <Label>{label}</Label>
    <NodePickerField
      {...rest}
      constants={constants}
      isDisabled={!isEditMode}
      isMulti={isMulti}
      placeholder={placeholder}
      schemas={schemas}
      selectComponents={{ MultiValueLabel, Option }}
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
  placeholder: 'Select related people...',
};

export default PeoplePickerField;
