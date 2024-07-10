import React from 'react';
import { Alert, Spinner } from 'reactstrap';
import classNames from 'classnames';

export default function Loading(props) {
  const { error, inline, fixed, overlay, size = 'sm', color = 'light', children = 'Loading...' } = props;
  if (error) {
    return <Alert color="danger">{error}</Alert>;
  }

  const containerClassName = classNames(
    'loading-container',
    { 'loading-inline': inline },
    { 'loading-fixed': fixed },
    { 'loading-overlay': overlay },
  );

  const childrenClassName = classNames(
    'loading-children',
    `text-${color}`,
  );

  return (
    <div className={containerClassName}>
      <Spinner color={color} size={size} />
      {children && <span className={childrenClassName}>{children}</span>}
    </div>
  );
}
