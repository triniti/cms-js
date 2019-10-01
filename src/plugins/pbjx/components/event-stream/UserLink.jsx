import React from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';
import pbjUrl from '@gdbots/pbjx/pbjUrl';
import { RouterLink } from '@triniti/admin-ui-plugin/components';

const UserLink = ({ user }) => {
  if (!user) {
    return 'SYSTEM';
  }

  let userName = `${user.get('first_name', '')} ${user.get('last_name', '')}`.trim();
  if (!userName) {
    userName = user.get('email');
  }

  return (
    <RouterLink to={pbjUrl(user, 'cms')} target="_black">
      {userName}
    </RouterLink>
  );
};

UserLink.propTypes = {
  user: PropTypes.instanceOf(Message),
};

UserLink.defaultProps = {
  user: null,
};

export default UserLink;
