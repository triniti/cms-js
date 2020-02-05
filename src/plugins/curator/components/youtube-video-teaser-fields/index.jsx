import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import Message from '@gdbots/pbj/Message';
import Schema from '@gdbots/pbj/Schema';
import TextField from '@triniti/cms/components/text-field';
import TeaserFields from '@triniti/cms/plugins/curator/components/teaser-fields';
import { formNames } from '../../constants';
import delegate from './delegate';

// https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
const YOUTUBE_REGEX = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;

const handleStripYoutubeId = (e, value, oldValue, fieldName, handleChange) => {
  if (YOUTUBE_REGEX.test(value)) {
    e.preventDefault();
    handleChange(formNames.TEASER, fieldName, value.match(YOUTUBE_REGEX)[1]);
  }
};

const renderPickerComponent = (handleChange) => (
  <>
    <Field
      component={TextField}
      label="YouTube URL or Video Id"
      onChange={(e, value, oldValue, fieldName) => handleStripYoutubeId(e, value, oldValue, fieldName, handleChange)} // eslint-disable-line max-len
      name="youtubeVideoId"
      readOnly={false}
    />
    <Field
      component={TextField}
      label="YouTube Custom URL or Video Id"
      onChange={(e, value, oldValue, fieldName) => handleStripYoutubeId(e, value, oldValue, fieldName, handleChange)} // eslint-disable-line max-len
      name="youtubeCustomId"
      readOnly={false}
    />
  </>
);

const YoutubeVideoTeaserFields = ({ handleChange, isEditMode, node, schemas }) => (
  <TeaserFields
    isEditMode={isEditMode}
    node={node}
    schemas={schemas}
    pickerComponent={() => renderPickerComponent(handleChange)}
  />
);

YoutubeVideoTeaserFields.propTypes = {
  handleChange: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
  schemas: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.instanceOf(Schema),
    PropTypes.arrayOf(PropTypes.instanceOf(Schema)),
  ])).isRequired,
};

YoutubeVideoTeaserFields.defaultProps = {
  isEditMode: false,
};

export default connect(null, delegate)(YoutubeVideoTeaserFields);
