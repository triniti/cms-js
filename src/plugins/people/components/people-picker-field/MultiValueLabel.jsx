import { components } from 'react-select';
import pbjUrl from '@gdbots/pbjx/pbjUrl';
import PropTypes from 'prop-types';
import React from 'react';

const MultiValueLabel = (props) => {
  const { children, data: { node } } = props;
  return (
    <components.MultiValueLabel {...props}>
      <a href={pbjUrl(node, 'canonical')} target="_blank" rel="noopener noreferrer">{ children }</a>
    </components.MultiValueLabel>
  );
};

MultiValueLabel.propTypes = {
  children: PropTypes.node.isRequired,
  data: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default MultiValueLabel;
