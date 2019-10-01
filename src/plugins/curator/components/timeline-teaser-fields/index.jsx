import { FieldArray } from 'redux-form';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import Schema from '@gdbots/pbj/Schema';
import TeaserFields from '@triniti/cms/plugins/curator/components/teaser-fields';
import TimelinePickerField from '@triniti/cms/plugins/curator/components/timeline-picker-field';

const PickerComponent = (props) => (
  <FieldArray
    isEditMode={false}
    name="targetRefs"
    multi={false}
    component={TimelinePickerField}
    {...props}
  />
);

const TimelineTeaserFields = ({ isEditMode, node, schemas }) => (
  <TeaserFields
    isEditMode={isEditMode}
    node={node}
    schemas={schemas}
    pickerComponent={PickerComponent}
  />
);

TimelineTeaserFields.propTypes = {
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
  schemas: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.instanceOf(Schema),
    PropTypes.arrayOf(PropTypes.instanceOf(Schema)),
  ])).isRequired,
};

TimelineTeaserFields.defaultProps = {
  isEditMode: false,
};

export default TimelineTeaserFields;
