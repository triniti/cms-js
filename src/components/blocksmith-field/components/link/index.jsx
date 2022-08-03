import React from 'react';

export default function Link({ children, className, contentState, entityKey }) {
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
