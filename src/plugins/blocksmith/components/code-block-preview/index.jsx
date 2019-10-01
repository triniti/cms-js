/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';

const CodeBlockPreview = ({ block }) => <div dangerouslySetInnerHTML={{ __html: block.get('code') }} />;

CodeBlockPreview.propTypes = {
  block: PropTypes.instanceOf(Message).isRequired,
};

export default CodeBlockPreview;
