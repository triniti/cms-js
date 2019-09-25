import noop from 'lodash/noop';
import React from 'react';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { Card, Table } from '@triniti/admin-ui-plugin/components';
import PropTypes from 'prop-types';

import TableHeader from './TableHeader';
import TableBody from './TableBody';

const ArticlesTable = ({
  areAllChecked,
  disabled,
  hasCheckboxes,
  nodes,
  onChangeAllRows,
  onSelectRow,
  onSort,
  selectedRows,
  sort,
  striped,
}) => (
  <Card>
    <Table className="table-borderless table-stretch" hover responsive striped={striped}>
      <TableHeader
        areAllChecked={areAllChecked}
        hasCheckboxes={hasCheckboxes}
        onChangeAllRows={onChangeAllRows}
        onSort={onSort}
        sort={sort}
      />
      <TableBody
        articles={nodes}
        disabled={disabled}
        hasCheckboxes={hasCheckboxes}
        onSelectRow={onSelectRow}
        selectedRows={selectedRows}
      />
    </Table>
  </Card>
);

ArticlesTable.propTypes = {
  areAllChecked: PropTypes.bool,
  disabled: PropTypes.bool,
  hasCheckboxes: PropTypes.bool,
  nodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
  onChangeAllRows: PropTypes.func,
  onSelectRow: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)),
  sort: PropTypes.string.isRequired,
  striped: PropTypes.bool,
};

ArticlesTable.defaultProps = {
  areAllChecked: false,
  disabled: false,
  hasCheckboxes: true,
  onChangeAllRows: noop,
  selectedRows: [],
  striped: false,
};

export default ArticlesTable;
