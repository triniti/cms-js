import PropTypes from 'prop-types';
import React from 'react';

import Message from '@gdbots/pbj/Message';
import { Card, Table } from '@triniti/admin-ui-plugin/components';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';

import TableBody from './TableBody';
import TableHeader from './TableHeader';

const PagesTable = ({
  disabled, areAllChecked, nodes, onChangeAllRows, onSelectRow, onSort, selectedRows, sort,
}) => (
  <Card>
    <Table className="table-stretch" borderless hover responsive>
      <TableHeader
        areAllChecked={areAllChecked}
        onChangeAllRows={onChangeAllRows}
        onSort={onSort}
        pages={nodes}
        sort={sort}
      />
      <TableBody
        disabled={disabled}
        onSelectRow={onSelectRow}
        pages={nodes}
        selectedRows={selectedRows}
      />
    </Table>
  </Card>
);

PagesTable.propTypes = {
  areAllChecked: PropTypes.bool,
  disabled: PropTypes.bool,
  nodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
  onChangeAllRows: PropTypes.func.isRequired,
  onSelectRow: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)),
  sort: PropTypes.string.isRequired,
};

PagesTable.defaultProps = {
  disabled: false,
  areAllChecked: false,
  selectedRows: [],
};

export default PagesTable;
