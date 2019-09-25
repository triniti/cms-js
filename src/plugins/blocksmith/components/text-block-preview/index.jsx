/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';

const TextBlockPreview = ({ block }) => <div dangerouslySetInnerHTML={{ __html: block.get('text') }} />;

TextBlockPreview.propTypes = {
  block: PropTypes.instanceOf(Message).isRequired,
};

export default TextBlockPreview;
