import { Label } from '@triniti/admin-ui-plugin/components';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field';
import PropTypes from 'prop-types';
import React from 'react';
import constants from './constants';
import Menu from './Menu';
import Option from './Option';
import schemas from './schemas';
import SortableList from './SortableList';

const GalleryPickerField = (props) => {
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
          <Label>{label || `search and select ${isMulti ? 'galleries' : 'a gallery'}`}</Label>
          <NodePickerField
            {...props}
            className="mb-4"
            constants={constants}
            isClearable={false}
            isDisabled={!isEditMode}
            schemas={schemas}
            selectComponents={{
              Menu,
              MultiValue: () => null,
              Option,
              SingleValue: () => null,
            }}
          />
        </>
      )}
    </>
  );
};

GalleryPickerField.propTypes = {
  disabled: PropTypes.bool,
  fields: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  isEditMode: PropTypes.bool,
  isMulti: PropTypes.bool,
  label: PropTypes.string,
};

GalleryPickerField.defaultProps = {
  disabled: false,
  isEditMode: true,
  isMulti: true,
  label: null,
};

export default GalleryPickerField;
