import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import { Card, Table } from '@triniti/admin-ui-plugin/components';

import TableBody from './TableBody';
import TableHeader from './TableHeader';

const WidgetsTable = ({ history, nodes, onSort, sort }) => (
  <Card>
    <Table className="table-borderless table-stretch" hover responsive>
      <TableHeader
        onSort={onSort}
        nodes={nodes}
        sort={sort}
      />
      <TableBody
        nodes={nodes}
        history={history}
      />
    </Table>
  </Card>
);

WidgetsTable.propTypes = {
  history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  nodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
  onSort: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
};

export default WidgetsTable;
