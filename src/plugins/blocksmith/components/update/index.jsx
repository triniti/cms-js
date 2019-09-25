import React from 'react';
import PropTypes from 'prop-types';
import { styleUpdateBlocks } from '../../utils';

const Update = ({ children, entityKey }) => {
  styleUpdateBlocks(entityKey);
  return (
    <span data-entity-key={entityKey}>{children}</span>
  );
};

Update.propTypes = {
  children: PropTypes.node.isRequired,
  entityKey: PropTypes.string.isRequired,
};

export default Update;
