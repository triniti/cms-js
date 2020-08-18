import React from 'react';
import PropTypes from 'prop-types';
import chroma from 'chroma-js';
import Message from '@gdbots/pbj/Message';
import labelColors from 'config/labels'; // eslint-disable-line import/no-unresolved

import './styles.scss';

const createStyle = (label) => {
  if (!labelColors[label]) {
    return {};
  }

  const color = chroma(labelColors[label]);
  return {
    backgroundColor: color.alpha(0.3).css(),
  };
};

const Labels = ({ node }) => node.get('labels', []).map((label) => <span className="label" style={createStyle(label)}>{label}</span>);

Labels.protoTypes = {
  node: PropTypes.instanceOf(Message).isRequired,
};

export default Labels;
