import { FieldArray } from 'redux-form';
import Message from '@gdbots/pbj/Message';
import PollPickerField from '@triniti/cms/plugins/apollo/components/poll-picker-field';
import PropTypes from 'prop-types';
import React from 'react';
import Schema from '@gdbots/pbj/Schema';
import TeaserFields from '@triniti/cms/plugins/curator/components/teaser-fields';

const PickerComponent = (props) => (
  <FieldArray
    isEditMode={false}
    name="targetRefs"
    multi={false}
    component={PollPickerField}
    {...props}
  />
);

const PollTeaserFields = ({ isEditMode, node, schemas }) => (
  <TeaserFields
    isEditMode={isEditMode}
    node={node}
    schemas={schemas}
    pickerComponent={PickerComponent}
  />
);

PollTeaserFields.propTypes = {
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
  schemas: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.instanceOf(Schema),
    PropTypes.arrayOf(PropTypes.instanceOf(Schema)),
  ])).isRequired,
};

PollTeaserFields.defaultProps = {
  isEditMode: false,
};

export default PollTeaserFields;
