import React from 'react';
import classNames from 'classnames';
import '@triniti/cms/components/scrollable-container/styles.scss';

export default function ScrollableContainer({ children, className, tag: Tag = 'span', ...attributes }) {
  const classes = classNames(className, 'scrollable-container');
  return <Tag {...attributes} className={classes}>{children}</Tag>;
}
