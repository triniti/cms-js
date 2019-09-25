import PropTypes from 'prop-types';
import React from 'react';

import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import TableRow from './TableRow';

const TableBody = ({
  disabled,
  isBulkOperationEnabled,
  onSelectRow,
  polls,
  selectedRows,
}) => (
  <tbody>
    {
      polls.map((poll) => (
        <TableRow
          disabled={disabled}
          isBulkOperationEnabled={isBulkOperationEnabled}
          isSelected={selectedRows.some((item) => item.getId() === poll.get('_id').toString())}
          key={poll.get('_id')}
          onSelectRow={onSelectRow}
          poll={poll}
        />
      ))
    }
  </tbody>
);

TableBody.propTypes = {
  disabled: PropTypes.bool,
  isBulkOperationEnabled: PropTypes.bool,
  onSelectRow: PropTypes.func.isRequired,
  polls: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
  selectedRows: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)),
};

TableBody.defaultProps = {
  disabled: false,
  isBulkOperationEnabled: true,
  polls: [],
  selectedRows: [],
};

export default TableBody;
