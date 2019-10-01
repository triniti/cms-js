import PropTypes from 'prop-types';
import React from 'react';

import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { Card, Table } from '@triniti/admin-ui-plugin/components';

import TableBody from './TableBody';
import TableHeader from './TableHeader';

const PeopleTable = ({
  nodes: people,
  disabled,
  areAllChecked,
  onChangeAllRows,
  onSelectRow,
  onSort,
  selectedRows,
  sort,
}) => (
  <Card>
    <Table className="table-stretch" borderless hover responsive>
      <TableHeader
        areAllChecked={areAllChecked}
        onChangeAllRows={onChangeAllRows}
        onSort={onSort}
        sort={sort}
      />
      <TableBody
        people={people}
        disabled={disabled}
        onSelectRow={onSelectRow}
        selectedRows={selectedRows}
      />
    </Table>
  </Card>
);

PeopleTable.propTypes = {
  areAllChecked: PropTypes.bool,
  disabled: PropTypes.bool,
  nodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
  onChangeAllRows: PropTypes.func.isRequired,
  onSelectRow: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)),
  sort: PropTypes.string.isRequired,
};

PeopleTable.defaultProps = {
  areAllChecked: false,
  disabled: false,
  selectedRows: [],
};

export default PeopleTable;
