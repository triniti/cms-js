import { Label } from '@triniti/admin-ui-plugin/components';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field';
import PropTypes from 'prop-types';
import React from 'react';
import constants from './constants';
import Menu from './Menu';
import Option from './Option';
import schemas from './schemas';
import SortableList from './SortableList';

const PollPickerField = (props) => {
  const { disabled, fields, isEditMode, isMulti, label } = props;
  return (
    <>
      {!!fields.length && (
        <SortableList
          fields={fields}
          isMulti={isMulti}
          readOnly={!isEditMode || disabled}
        />
      )}
      {isEditMode && (
        <>
          <Label>{label || `search and select ${isMulti ? 'polls' : 'a poll'}`}</Label>
          <NodePickerField
            {...props}
            constants={constants}
            isClearable={false}
            isDisabled={!isEditMode}
            isMulti={isMulti}
            schemas={schemas}
            selectComponents={{
              Menu,
              MultiValue: () => null,
              Option,
              SingleValue: () => null,
            }}
            shouldClearInputOnSelect={false}
          />
        </>
      )}
    </>
  );
};

PollPickerField.propTypes = {
  disabled: PropTypes.bool,
  isEditMode: PropTypes.bool,
  isMulti: PropTypes.bool,
  label: PropTypes.string,
};

PollPickerField.defaultProps = {
  disabled: false,
  isEditMode: true,
  isMulti: true,
  label: null,
};

export default PollPickerField;
