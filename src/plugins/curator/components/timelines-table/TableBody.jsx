import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import TableRow from './TableRow';

const TableBody = ({ disabled, nodes, onSelectRow, selectedRows }) => (
  <tbody>
    {
      nodes.map((node) => (
        <TableRow
          disabled={disabled}
          key={node.get('_id')}
          node={node}
          onSelectRow={onSelectRow}
          isSelected={selectedRows.some((item) => item.getId() === node.get('_id').toString())}
        />
      ))
    }
  </tbody>
);

TableBody.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
  disabled: PropTypes.bool,
  onSelectRow: PropTypes.func.isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.object),
};

TableBody.defaultProps = {
  nodes: [],
  disabled: false,
  selectedRows: [],
};

export default TableBody;
