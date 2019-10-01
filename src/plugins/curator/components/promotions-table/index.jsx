import PropTypes from 'prop-types';
import React from 'react';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { Card, Table } from '@triniti/admin-ui-plugin/components';

import TableBody from './TableBody';
import TableHeader from './TableHeader';

const PromotionsTable = ({
  areAllChecked,
  disabled,
  history,
  nodes,
  onChangeAllRows,
  onSelectRow,
  onSort,
  selectedRows,
  sort,
}) => (
  <Card>
    <Table className="table-borderless table-stretch" hover responsive>
      <TableHeader
        areAllChecked={areAllChecked}
        onChangeAllRows={onChangeAllRows}
        onSort={onSort}
        sort={sort}
      />
      <TableBody
        disabled={disabled}
        history={history}
        nodes={nodes}
        onSelectRow={onSelectRow}
        selectedRows={selectedRows}
      />
    </Table>
  </Card>
);

PromotionsTable.propTypes = {
  areAllChecked: PropTypes.bool,
  disabled: PropTypes.bool,
  history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  nodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
  onChangeAllRows: PropTypes.func.isRequired,
  onSelectRow: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)),
  sort: PropTypes.string.isRequired,
};

PromotionsTable.defaultProps = {
  areAllChecked: false,
  disabled: false,
  selectedRows: [],
};

export default PromotionsTable;
