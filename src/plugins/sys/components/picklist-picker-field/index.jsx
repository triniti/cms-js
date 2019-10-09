import React from 'react';
import PropTypes from 'prop-types';

import { FormGroup } from '@triniti/admin-ui-plugin/components';

import PicklistPicker from '../picklist-picker/index';
import './styles.scss';

const PicklistPickerField = (props) => {
  const {
    label,
    isEditMode,
    meta: { error, warning, touched },
    picklistId,
    input,
    ...rest
  } = props;

  return (
    <FormGroup>
      <PicklistPicker
        error={error}
        warning={warning}
        touched={touched}
        picklistId={picklistId}
        label={label}
        isEditMode={isEditMode}
        onChange={input.onChange}
        value={input.value}
        {...rest}
      />
    </FormGroup>
  );
};

PicklistPickerField.propTypes = {
  label: PropTypes.string.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  picklistId: PropTypes.string.isRequired,
  input: PropTypes.object.isRequired, // eslint-disable-line
  meta: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default PicklistPickerField;
