import React from 'react';
import PropTypes from 'prop-types';
import { ContentState } from 'draft-js';

const Link = ({
  children,
  className,
  contentState,
  entityKey,
}) => {
  const entity = contentState.getEntity(entityKey);
  const entityData = entity ? entity.get('data') : undefined;
  const href = (entityData && entityData.url) || undefined;
  const target = (entityData && entityData.target) || '_blank';

  return (
    <a
      className={className}
      href={href}
      rel="noopener noreferrer"
      target={target}
      title={href}
    >
      {children}
    </a>
  );
};

Link.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  contentState: PropTypes.instanceOf(ContentState).isRequired,
  entityKey: PropTypes.string.isRequired,
};

Link.defaultProps = {
  className: '',
};

export default Link;
