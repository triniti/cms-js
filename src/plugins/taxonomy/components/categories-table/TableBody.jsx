import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import TableRow from './TableRow';

const TableBody = ({ disabled, nodes, selectedRows }) => (
  <tbody>
    {nodes.map((node) => (
      <TableRow
        disabled={disabled}
        isSelected={selectedRows.some((item) => item.getId() === node.get('_id').toString())}
        key={node.get('_id')}
        node={node}
      />
    ))}
  </tbody>
);


TableBody.propTypes = {
  disabled: PropTypes.bool,
  nodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
  selectedRows: PropTypes.arrayOf(PropTypes.object),
};

TableBody.defaultProps = {
  disabled: false,
  nodes: [],
  selectedRows: [],
};

export default TableBody;
