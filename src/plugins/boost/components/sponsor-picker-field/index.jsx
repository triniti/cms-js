import { FormGroup, Label } from '@triniti/admin-ui-plugin/components';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field';
import PropTypes from 'prop-types';
import React from 'react';
import constants from './constants';
import schemas from './schemas';

const SponsorPickerField = ({ label, isEditMode, placeholder, ...rest }) => (
  <FormGroup>
    <Label>{label}</Label>
    <NodePickerField
      {...rest}
      constants={constants}
      isClearable
      isDisabled={!isEditMode}
      isMulti={false}
      placeholder={placeholder || 'Select a sponsor...'}
      schemas={schemas}
    />
  </FormGroup>
);

SponsorPickerField.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
};

SponsorPickerField.defaultProps = {
  label: 'Sponsor',
  placeholder: null,
};

export default SponsorPickerField;
