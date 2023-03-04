import classNames from 'classnames';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import UncontrolledTooltip from 'components/uncontrolled-tooltip';
import isString from 'lodash-es/isString';

import selector from './selector';
import './styles.scss';

const Collaborators = ({ className, nodeRef, users }) => (
  <div key="users" className={classNames(className, 'screen-primary-actions-collaborators')}>
    {users.map((user) => {
      const id = user.get('_id').toString();
      const title = user.get('title') || `${user.get('first_name', '')} ${user.get('last_name', '')}`;
      const first = user.get('first_name', '').substr(0, 1).toUpperCase();
      const last = user.get('last_name', '').substr(0, 1).toUpperCase();

      let initials = `${first}${last}`;
      if (initials.length < 1) {
        initials = title.substr(0, 2).toUpperCase();
      }

      const target = `initials-${id}-${(isString(nodeRef) ? nodeRef : nodeRef.toString()).replace(/:/g, '-')}`;
      return (
        <Fragment key={`initials-${id}`}>
          <span
            id={target}
            className="avatar-initials avatar-initials-sm badge-indicator"
          >
            {initials}
          </span>
          <UncontrolledTooltip placement="top" target={target}>
            {title}
          </UncontrolledTooltip>
        </Fragment>
      );
    })}
  </div>
);

export default connect(selector)(Collaborators);