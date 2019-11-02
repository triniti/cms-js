import { Label } from '@triniti/admin-ui-plugin/components';
import React from 'react';
import PropTypes from 'prop-types';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field';
import Option from './Option';
import Menu from './Menu';
import constants from './constants';
import schemas from './schemas';
import SortableList from './SortableList';

const PagePickerField = (props) => {
  const { disabled, fields, isEditMode, isMulti } = props;
  return (
    <>
      {!!fields.length && (
        <SortableList
          fields={fields}
          isMulti={isMulti}
          readOnly={!isEditMode || disabled}
        />
      )}
      <Label>{`search and select ${isMulti ? 'pages' : 'a page'}`}</Label>
      <NodePickerField
        {...props}
        className="mb-4"
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
      />
    </>
  );
};

PagePickerField.propTypes = {
  disabled: PropTypes.bool,
  fields: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  isEditMode: PropTypes.bool,
  isMulti: PropTypes.bool,
};

PagePickerField.defaultProps = {
  disabled: false,
  isEditMode: true,
  isMulti: true,
};

export default PagePickerField;
