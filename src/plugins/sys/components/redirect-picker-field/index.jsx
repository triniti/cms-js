import { FormGroup, Label } from '@triniti/admin-ui-plugin/components';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field';
import PropTypes from 'prop-types';
import React from 'react';
import RedirectId from '@triniti/schemas/triniti/sys/RedirectId';
import constants from './constants';
import schemas from './schemas';

const RedirectPickerField = ({ label, isEditMode, ...rest }) => (
  <FormGroup>
    <Label>{label}</Label>
    <NodePickerField
      {...rest}
      constants={constants}
      isClearable
      isDisabled={!isEditMode}
      isMulti={false}
      optionsMapper={(nodeRef) => {
        const uri = new RedirectId(nodeRef.getId()).toUri();
        return { label: uri, value: nodeRef };
      }}
      schemas={schemas}
    />
  </FormGroup>
);

RedirectPickerField.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  label: PropTypes.string,
};

RedirectPickerField.defaultProps = {
  label: 'Categories',
};

export default RedirectPickerField;
