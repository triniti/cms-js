import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import { Card, Table } from '@triniti/admin-ui-plugin/components';

import UserTableHeader from './TableHeader';
import UserTableBody from './TableBody';

const UsersTable = ({ nodes }) => (
  <Card>
    <Table className="table-borderless table-stretch" hover responsive>
      <UserTableHeader />
      <UserTableBody users={nodes} />
    </Table>
  </Card>
);

UsersTable.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
};

UsersTable.defaultProps = {
  nodes: [],
};

export default UsersTable;
