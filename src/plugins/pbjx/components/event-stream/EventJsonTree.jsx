import React from 'react';
import PropTypes from 'prop-types';
import JSONTree from 'react-json-tree';
import { getBase16Theme } from 'react-base16-styling';
import { jsonTreeValueRenderer, jsonTreeLabelRenderer } from './jsonTreeRenderer';

const EventJsonTree = ({ data, color }) => (
  <JSONTree
    hideRoot
    data={data}
    theme={getBase16Theme('tomorrow')}
    labelRenderer={jsonTreeLabelRenderer}
    valueRenderer={(raw) => jsonTreeValueRenderer(raw, color)}
  />
);

EventJsonTree.propTypes = {
  data: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  color: PropTypes.string,
};

EventJsonTree.defaultProps = {
  color: 'bg-success',
};

export default EventJsonTree;
