import { Label } from '@triniti/admin-ui-plugin/components';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import constants from './constants';
import Menu from './Menu';
import Option from './Option';
import schemas from './schemas';
import SortableList from './SortableList';

let selectComponents = {
  Menu,
  MultiValue: () => null,
  Option,
  SingleValue: () => null,
};
const PollPickerField = (props) => {
  const { disabled, fields, isEditMode, isMulti, label } = props;
  useEffect(() => () => { selectComponents = {}; }, []);
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
            selectComponents={selectComponents}
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
