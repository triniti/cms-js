import React from 'react';
import PropTypes from 'prop-types';
import chroma from 'chroma-js';
import Message from '@gdbots/pbj/Message';
import labelColors from 'config/nodeLabels'; // eslint-disable-line import/no-unresolved

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

const NodeLabels = ({ node }) => node.get('labels', []).map((label) => <span key={label} className="label" style={createStyle(label)}>{label}</span>);

NodeLabels.protoTypes = {
  node: PropTypes.instanceOf(Message).isRequired,
};

export default NodeLabels;
