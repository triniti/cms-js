import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import { Card, Table } from '@triniti/admin-ui-plugin/components';

import TableBody from './TableBody';
import TableHeader from './TableHeader';

const NotificationsTable = ({ disabled, nodes, onSort, sort }) => (
  <Card>
    <Table className="table-borderless table-stretch" hover responsive>
      <TableHeader onSort={onSort} nodes={nodes} sort={sort} />
      <TableBody disabled={disabled} nodes={nodes} />
    </Table>
  </Card>
);

NotificationsTable.propTypes = {
  disabled: PropTypes.bool,
  nodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
  onSort: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
};

NotificationsTable.defaultProps = {
  disabled: false,
};

export default NotificationsTable;
