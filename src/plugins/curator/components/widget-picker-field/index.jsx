import { Label } from '@triniti/admin-ui-plugin/components';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import constants from './constants';
import Menu from './Menu';
import Option from './Option';
import schemas from './schemas';
import SortableList from './SortableList';
import './styles.scss';

let selectComponents = {
  MultiValue: () => null,
  Option,
  Menu,
};
const WidgetPickerField = (props) => {
  const { disabled, fields, isEditMode, isMulti } = props;
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
          <Label>{`search and select ${isMulti ? 'widgets' : 'a widget'}`}</Label>
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

WidgetPickerField.propTypes = {
  disabled: PropTypes.bool,
  isEditMode: PropTypes.bool,
  isMulti: PropTypes.bool,
};

WidgetPickerField.defaultProps = {
  disabled: false,
  isEditMode: true,
  isMulti: true,
};

export default WidgetPickerField;
