import React from 'react';
import classNames from 'classnames';
import '@triniti/cms/components/scrollable-container/styles.scss';

const ScrollableContainer = ({ children, className, tag: Tag = 'span', ...attributes }) => {
  const classes = classNames(
    className,
    'scrollable-container',
  );

  return (
    <Tag {...attributes} className={classes}>{children}</Tag>
  );
};

export default ScrollableContainer;
