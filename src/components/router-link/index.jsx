import React from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

export default function RouterLink({ to, navTab = false, active = false, ...attributes }) {
  return (
    <NavLink
      className={classNames({
        'nav-link': navTab,
        'active': active,
      })}
      to={to}
      {...attributes}
    />
  );
}
