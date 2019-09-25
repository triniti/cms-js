import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import Message from '@gdbots/pbj/Message';
import TableRow from './TableRow';

const TableBody = ({
  nodes,
  onSelectNode: handleSelectNode,
  selectedNode,
}) => (
  <tbody>
    {
      nodes.map((node) => (
        <TableRow
          isSelected={selectedNode && node.get('_id').toString() === selectedNode.get('_id').toString()}
          key={node.get('_id').toString()}
          node={node}
          onSelectNode={handleSelectNode}
        />
      ))
    }
  </tbody>
);

TableBody.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
  onSelectNode: PropTypes.func,
  selectedNode: PropTypes.instanceOf(Message),
};

TableBody.defaultProps = {
  onSelectNode: noop,
  selectedNode: null,
};

export default TableBody;
