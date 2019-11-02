import { Label } from '@triniti/admin-ui-plugin/components';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field';
import PropTypes from 'prop-types';
import React from 'react';
import constants from './constants';
import Menu from './Menu';
import Option from './Option';
import schemas from './schemas';
import SortableList from './SortableList';

const VideoPickerField = (props) => {
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
      <Label>{`search and select ${isMulti ? 'videos' : 'a video'}`}</Label>
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

VideoPickerField.propTypes = {
  disabled: PropTypes.bool,
  fields: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  isEditMode: PropTypes.bool,
  isMulti: PropTypes.bool,
};

VideoPickerField.defaultProps = {
  disabled: false,
  isEditMode: true,
  isMulti: true,
};

export default VideoPickerField;
