import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import PropTypes from 'prop-types';
import React from 'react';
import TableRow from './TableRow';

const TableBody = ({
  galleries, disabled, onSelectRow, selectedRows,
}) => (
  <tbody>
    {galleries.map(gallery => (
      <TableRow
        gallery={gallery}
        key={gallery.get('_id')}
        disabled={disabled}
        onSelectRow={onSelectRow}
        isSelected={selectedRows.some(item => item.getId() === gallery.get('_id').toString())}
      />
    ))}
  </tbody>
);

TableBody.propTypes = {
  galleries: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
  disabled: PropTypes.bool,
  onSelectRow: PropTypes.func.isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)),
};

TableBody.defaultProps = {
  galleries: [],
  disabled: false,
  selectedRows: [],
};

export default TableBody;
