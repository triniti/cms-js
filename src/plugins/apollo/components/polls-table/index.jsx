import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import React from 'react';

import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { Card, Table } from '@triniti/admin-ui-plugin/components';

import TableBody from './TableBody';
import TableHeader from './TableHeader';

const PollsTable = ({
  areAllChecked,
  disabled,
  isBulkOperationEnabled,
  nodes,
  onChangeAllRows,
  onSelectRow,
  onSort,
  selectedRows,
  sort,
}) => {
  let tableProps = {
    hover: true,
  };
  if (isBulkOperationEnabled) {
    tableProps = {
      borderless: true,
      responsive: true,
      className: 'table-stretch',
      ...tableProps,
    };
  } else {
    tableProps = {
      sticky: 'head',
      striped: true,
      ...tableProps,
    };
  }
  return (
    <Card>
      <Table {...tableProps}>
        <TableHeader
          areAllChecked={areAllChecked}
          isBulkOperationEnabled={isBulkOperationEnabled}
          onChangeAllRows={onChangeAllRows}
          onSort={onSort}
          sort={sort}
        />
        <TableBody
          disabled={disabled}
          isBulkOperationEnabled={isBulkOperationEnabled}
          onSelectRow={onSelectRow}
          polls={nodes}
          selectedRows={selectedRows}
        />
      </Table>
    </Card>
  );
};

PollsTable.propTypes = {
  areAllChecked: PropTypes.bool,
  disabled: PropTypes.bool,
  isBulkOperationEnabled: PropTypes.bool,
  nodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
  onChangeAllRows: PropTypes.func,
  onSelectRow: PropTypes.func.isRequired,
  onSort: PropTypes.func,
  selectedRows: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)),
  sort: PropTypes.string,
};

PollsTable.defaultProps = {
  areAllChecked: false,
  disabled: false,
  isBulkOperationEnabled: true,
  onChangeAllRows: noop,
  onSort: noop,
  selectedRows: [],
  sort: 'created-at-desc',
};

export default PollsTable;
