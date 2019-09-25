import { FieldArray } from 'redux-form';
import Message from '@gdbots/pbj/Message';
import PagePickerField from '@triniti/cms/plugins/canvas/components/page-picker-field';
import PropTypes from 'prop-types';
import React from 'react';
import Schema from '@gdbots/pbj/Schema';
import TeaserFields from '@triniti/cms/plugins/curator/components/teaser-fields';

const PickerComponent = (props) => (
  <FieldArray
    name="targetRefs"
    component={PagePickerField}
    isEditMode={false}
    {...props}
  />
);

const PageTeaserFields = ({ isEditMode, node, schemas }) => (
  <TeaserFields
    isEditMode={isEditMode}
    node={node}
    schemas={schemas}
    pickerComponent={PickerComponent}
  />
);

PageTeaserFields.propTypes = {
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
  schemas: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.instanceOf(Schema),
    PropTypes.arrayOf(PropTypes.instanceOf(Schema)),
  ])).isRequired,
};

PageTeaserFields.defaultProps = {
  isEditMode: false,
};

export default PageTeaserFields;
