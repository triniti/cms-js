import PropTypes from 'prop-types';
import React from 'react';

import Message from '@gdbots/pbj/Message';
import { Card, Table } from '@triniti/admin-ui-plugin/components';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';

import TableBody from './TableBody';
import TableHeader from './TableHeader';

const CategoriesTable = ({ disabled, nodes, onSort, selectedRows, sort }) => (
  <Card>
    <Table className="table-borderless table-stretch" hover responsive>
      <TableHeader
        onSort={onSort}
        nodes={nodes}
        sort={sort}
      />
      <TableBody
        disabled={disabled}
        nodes={nodes}
        selectedRows={selectedRows}
      />
    </Table>
  </Card>
);

CategoriesTable.propTypes = {
  disabled: PropTypes.bool,
  nodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
  onSort: PropTypes.func.isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)),
  sort: PropTypes.string.isRequired,
};

CategoriesTable.defaultProps = {
  disabled: false,
  selectedRows: [],
};

export default CategoriesTable;
