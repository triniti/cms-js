import { FieldArray } from 'redux-form';
import GalleryPickerField from '@triniti/cms/plugins/curator/components/gallery-picker-field';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import Schema from '@gdbots/pbj/Schema';
import TeaserFields from '@triniti/cms/plugins/curator/components/teaser-fields';

const PickerComponent = (props) => (
  <FieldArray
    name="targetRefs"
    component={GalleryPickerField}
    isEditMode={false}
    {...props}
  />
);

const GalleryTeaserFields = ({ isEditMode, node, schemas }) => (
  <TeaserFields
    isEditMode={isEditMode}
    node={node}
    schemas={schemas}
    pickerComponent={PickerComponent}
  />
);

GalleryTeaserFields.propTypes = {
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
  schemas: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.instanceOf(Schema),
    PropTypes.arrayOf(PropTypes.instanceOf(Schema)),
  ])).isRequired,
};

GalleryTeaserFields.defaultProps = {
  isEditMode: false,
};

export default GalleryTeaserFields;
