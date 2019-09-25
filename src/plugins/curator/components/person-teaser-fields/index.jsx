import { FieldArray } from 'redux-form';
import Message from '@gdbots/pbj/Message';
import PeoplePickerField from '@triniti/cms/plugins/people/components/people-picker-field';
import PropTypes from 'prop-types';
import React from 'react';
import Schema from '@gdbots/pbj/Schema';
import TeaserFields from '@triniti/cms/plugins/curator/components/teaser-fields';

const PickerComponent = (props) => (
  <FieldArray
    name="targetRefs"
    component={PeoplePickerField}
    disabled
    {...props}
  />
);

const PersonTeaserFields = ({ isEditMode, node, schemas }) => (
  <TeaserFields
    isEditMode={isEditMode}
    node={node}
    schemas={schemas}
    pickerComponent={PickerComponent}
  />
);

PersonTeaserFields.propTypes = {
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
  schemas: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.instanceOf(Schema),
    PropTypes.arrayOf(PropTypes.instanceOf(Schema)),
  ])).isRequired,
};

PersonTeaserFields.defaultProps = {
  isEditMode: false,
};

export default PersonTeaserFields;
