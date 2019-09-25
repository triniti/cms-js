import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import UserTableRow from './TableRow';

const UserTableBody = ({ users }) => {
  let rowIndex = 1;
  return (
    <tbody>
      {users.map((user) => {
        const row = (
          <UserTableRow
            key={user.get('_id')}
            rowIndex={rowIndex}
            user={user}
          />
        );
        rowIndex += 1;
        return row;
      })}
    </tbody>
  );
};

UserTableBody.propTypes = {
  users: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
};

UserTableBody.defaultProps = {
  users: [],
};

export default UserTableBody;
