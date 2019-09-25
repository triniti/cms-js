import { FormGroup, Label } from '@triniti/admin-ui-plugin/components';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field';
import PropTypes from 'prop-types';
import React from 'react';
import constants from './constants';
import schemas from './schemas';

const ChannelPickerField = ({ label, isEditMode, placeholder, ...rest }) => (
  <FormGroup>
    <Label>{label}</Label>
    <NodePickerField
      {...rest}
      constants={constants}
      isClearable
      isDisabled={!isEditMode}
      isGetAll
      isMulti={false}
      placeholder="Select a channel..."
      schemas={schemas}
    />
  </FormGroup>
);

ChannelPickerField.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
};

ChannelPickerField.defaultProps = {
  label: 'Channel',
  placeholder: null,
};

export default ChannelPickerField;
