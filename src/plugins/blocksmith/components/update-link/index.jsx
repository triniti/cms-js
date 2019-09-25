import React from 'react';
import PropTypes from 'prop-types';
import Link from '@triniti/cms/plugins/blocksmith/components/link';
import { styleUpdateBlocks } from '../../utils';

const UpdateLink = ({ children, entityKey, ...rest }) => {
  styleUpdateBlocks(entityKey);
  return (
    <span data-entity-key={entityKey}>
      <Link entityKey={entityKey} {...rest}>{children}</Link>
    </span>
  );
};

UpdateLink.propTypes = {
  children: PropTypes.node.isRequired,
  entityKey: PropTypes.string.isRequired,
};

export default UpdateLink;
