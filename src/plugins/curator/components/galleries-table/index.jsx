import React from 'react';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { Card, Table } from '@triniti/admin-ui-plugin/components';
import PropTypes from 'prop-types';

import TableHeader from './TableHeader';
import TableBody from './TableBody';

const GalleriesTable = ({
  disabled, areAllChecked, nodes, onChangeAllRows, onSelectRow, onSort, selectedRows, sort,
}) => (
  <Card>
    <Table className="table-borderless table-stretch" hover responsive>
      <TableHeader
        areAllChecked={areAllChecked}
        galleries={nodes}
        onChangeAllRows={onChangeAllRows}
        onSort={onSort}
        sort={sort}
      />
      <TableBody
        disabled={disabled}
        galleries={nodes}
        onSelectRow={onSelectRow}
        selectedRows={selectedRows}
      />
    </Table>
  </Card>
);

GalleriesTable.propTypes = {
  disabled: PropTypes.bool,
  areAllChecked: PropTypes.bool,
  nodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
  onChangeAllRows: PropTypes.func.isRequired,
  onSelectRow: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)),
  sort: PropTypes.string.isRequired,
};

GalleriesTable.defaultProps = {
  disabled: false,
  areAllChecked: false,
  selectedRows: [],
};

export default GalleriesTable;
