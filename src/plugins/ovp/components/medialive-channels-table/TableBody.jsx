import Message from '@gdbots/pbj/Message';
import React from 'react';
import PropTypes from 'prop-types';
import TableRow from './TableRow';

const TableBody = ({
  disabled, hasCheckboxes, onSelectRow, selectedRows, nodes,
}) => (
  <tbody>
    {nodes.map((node) => (
      <TableRow
        disabled={disabled}
        hasCheckboxes={hasCheckboxes}
        isSelected={selectedRows.some((item) => item.id === node.get('_id').toString())}
        key={node.get('_id')}
        onSelectRow={onSelectRow}
        node={node}
      />
    ))}
  </tbody>
);

TableBody.propTypes = {
  disabled: PropTypes.bool,
  hasCheckboxes: PropTypes.bool,
  onSelectRow: PropTypes.func.isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.object),
  nodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
};

TableBody.defaultProps = {
  hasCheckboxes: true,
  disabled: false,
  selectedRows: [],
  nodes: [],
};

export default TableBody;
