import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles.scss';

const ScrollableContainer = ({ children, className, tag: Tag, ...attributes }) => {
  const classes = classNames(
    className,
    'scrollable-container',
  );

  return (
    <Tag {...attributes} className={classes}>{children}</Tag>
  );
};

ScrollableContainer.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
};

ScrollableContainer.defaultProps = {
  className: '',
  tag: 'div',
};

export default ScrollableContainer;