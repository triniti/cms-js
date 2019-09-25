import { Label } from '@triniti/admin-ui-plugin/components';
import React from 'react';
import PropTypes from 'prop-types';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field';
import Option from './Option';
import Menu from './Menu';
import constants from './constants';
import schemas from './schemas';
import SortableList from './SortableList';

const ArticlePickerField = (props) => {
  const { disabled, fields, isEditMode, isMulti } = props;
  const readOnly = !isEditMode || disabled;
  return (
    <>
      {!!fields.length && (
      <SortableList
        fields={fields}
        isMulti={isMulti}
        readOnly={readOnly}
      />
      )}
      {!readOnly && (
      <>
        <Label>{`search and select ${isMulti ? 'articles' : 'an article'}`}</Label>
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
        />
      </>
      )}
    </>
  );
};

ArticlePickerField.propTypes = {
  disabled: PropTypes.bool,
  fields: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  isEditMode: PropTypes.bool,
  isMulti: PropTypes.bool,
};

ArticlePickerField.defaultProps = {
  disabled: false,
  isEditMode: true,
  isMulti: true,
};

export default ArticlePickerField;
