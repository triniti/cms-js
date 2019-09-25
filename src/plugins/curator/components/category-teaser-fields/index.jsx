import PropTypes from 'prop-types';
import React from 'react';
import { FieldArray } from 'redux-form';
import Message from '@gdbots/pbj/Message';
import Schema from '@gdbots/pbj/Schema';
import CategoryPickerField from '@triniti/cms/plugins/taxonomy/components/category-picker-field';
import TeaserFields from '@triniti/cms/plugins/curator/components/teaser-fields';

const PickerComponent = (props) => (
  <FieldArray
    name="targetRefs"
    multi={false}
    isEditMode={false}
    component={CategoryPickerField}
    {...props}
  />
);

const CategoryTeaserFields = ({ isEditMode, node, schemas }) => (
  <TeaserFields
    isEditMode={isEditMode}
    node={node}
    schemas={schemas}
    pickerComponent={PickerComponent}
  />
);

CategoryTeaserFields.propTypes = {
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
  schemas: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.instanceOf(Schema),
    PropTypes.arrayOf(PropTypes.instanceOf(Schema)),
  ])).isRequired,
};

CategoryTeaserFields.defaultProps = {
  isEditMode: false,
};

export default CategoryTeaserFields;
