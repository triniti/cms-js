import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import TableRow from './TableRow';

const TableBody = ({ disabled, history, nodes, onSelectRow, selectedRows }) => (
  <tbody>
    {
      nodes.map((node) => (
        <TableRow
          disabled={disabled}
          history={history}
          isSelected={selectedRows.some((item) => item.getId() === node.get('_id').toString())}
          key={node.get('_id')}
          node={node}
          onSelectRow={onSelectRow}
        />
      ))
    }
  </tbody>
);

TableBody.propTypes = {
  disabled: PropTypes.bool,
  history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  nodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
  onSelectRow: PropTypes.func.isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.object),
};

TableBody.defaultProps = {
  nodes: [],
  disabled: false,
  selectedRows: [],
};

export default TableBody;
