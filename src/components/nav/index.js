import React from 'react';
import classNames from 'classnames';
import { Nav as NavRS } from 'reactstrap';

export default function Nav(props) {
  const {
    className = '',
    sticky = false,
    underline = false,
    ...attributes
  } = props;

  const classes = classNames(
    className,
    {
      'nav-sticky': sticky,
      'nav-underline': underline,
    },
  );

  return <NavRS {...attributes} className={classes} />;
};
