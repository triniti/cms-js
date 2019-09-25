import { FieldArray } from 'redux-form';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import Schema from '@gdbots/pbj/Schema';
import TeaserFields from '@triniti/cms/plugins/curator/components/teaser-fields';
import VideoPickerField from '@triniti/cms/plugins/ovp/components/video-picker-field';

const PickerComponent = (props) => (
  <FieldArray
    isEditMode={false}
    name="targetRefs"
    multi={false}
    component={VideoPickerField}
    {...props}
  />
);

const VideoTeaserFields = ({ isEditMode, node, schemas }) => (
  <TeaserFields
    isEditMode={isEditMode}
    node={node}
    schemas={schemas}
    pickerComponent={PickerComponent}
  />
);

VideoTeaserFields.propTypes = {
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
  schemas: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.instanceOf(Schema),
    PropTypes.arrayOf(PropTypes.instanceOf(Schema)),
  ])).isRequired,
};

VideoTeaserFields.defaultProps = {
  isEditMode: false,
};

export default VideoTeaserFields;
