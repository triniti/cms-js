import PropTypes from 'prop-types';
import React from 'react';
import Message from '@gdbots/pbj/Message';
import TableRow from './TableRow';

const TableBody = ({ disabled, nodes }) => (
  <tbody>
    {
      nodes.map((node) => (
        <TableRow
          disabled={disabled}
          key={node.get('_id')}
          node={node}
        />
      ))
    }
  </tbody>
);


TableBody.propTypes = {
  disabled: PropTypes.bool,
  nodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
};

TableBody.defaultProps = {
  disabled: false,
  nodes: [],
};

export default TableBody;
