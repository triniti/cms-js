import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import TextField from '@triniti/cms/components/text-field';
import delegate from './delegate';
import { formNames } from '../../constants';

// https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
const YOUTUBE_REGEX = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;

const handleStripYoutubeId = (e, value, oldValue, fieldName, handleChange) => {
  if (YOUTUBE_REGEX.test(value)) {
    e.preventDefault();
    handleChange(formNames.CREATE_TEASER, fieldName, value.match(YOUTUBE_REGEX)[1]);
  }
};

const CreateYoutubeVideoTeaserFields = ({ handleChange, onKeyDown: handleKeyDown }) => ([
  <Field key="a" onKeyDown={handleKeyDown} name="title" label="title" component={TextField} />,
  <Field
    component={TextField}
    key="b"
    label="YouTube URL or Video Id"
    name="youtubeVideoId"
    onChange={(e, value, oldValue, fieldName) => handleStripYoutubeId(e, value, oldValue, fieldName, handleChange)} // eslint-disable-line max-len
    onKeyDown={handleKeyDown}
  />,
]);

CreateYoutubeVideoTeaserFields.propTypes = {
  onKeyDown: PropTypes.func.isRequired,
};

export default connect(null, delegate)(CreateYoutubeVideoTeaserFields);
