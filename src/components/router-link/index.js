import React from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

export default function RouterLink({ className = '', to, navTab = false, active = false, ...attributes }) {
  return (
    <NavLink
      className={classNames(className, {
        'nav-link': navTab,
        'active': active,
      })}
      to={to}
      {...attributes}
    />
  );
}
