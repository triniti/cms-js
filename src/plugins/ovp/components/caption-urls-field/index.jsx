import React from 'react';
import { FieldArray } from 'redux-form';
import PropTypes from 'prop-types';
import { FormGroup, Label } from '@triniti/admin-ui-plugin/components';
import CaptionsField from './CaptionsField';

const CaptionUrlsField = ({ input, label, readOnly }) => {
  const options = [{ label: 'en', value: 'en' }, { label: 'es', value: 'es' }, { label: 'fr', value: 'fr' }];

  return (
    <FormGroup>
      {label && <Label for={input.name}>{label}</Label>}
      <FieldArray name="captionUrls" options={options} component={CaptionsField} isEditMode={!readOnly} />
    </FormGroup>
  );
};

CaptionUrlsField.propTypes = {
  input: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  readOnly: PropTypes.bool,
};

CaptionUrlsField.defaultProps = {
  label: '',
  readOnly: false,
};

export default CaptionUrlsField;
