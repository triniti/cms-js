import { FormGroup, Label } from '@triniti/admin-ui-plugin/components';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field';
import PropTypes from 'prop-types';
import React from 'react';
import constants from './constants';
import schemas from './schemas';

const TimelinePickerField = ({ label, isEditMode, ...rest }) => (
  <FormGroup>
    <Label>{label}</Label>
    <NodePickerField
      {...rest}
      constants={constants}
      isClearable
      isDisabled={!isEditMode}
      isMulti={false}
      schemas={schemas}
    />
  </FormGroup>
);

TimelinePickerField.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  label: PropTypes.string,
};

TimelinePickerField.defaultProps = {
  label: 'Timeline',
};

export default TimelinePickerField;
