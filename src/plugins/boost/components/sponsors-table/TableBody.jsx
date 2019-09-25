import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import PropTypes from 'prop-types';
import React from 'react';
import TableRow from './TableRow';

const TableBody = ({
  sponsors, disabled, onSelectRow, selectedRows,
}) => (
  <tbody>
    {sponsors.map((sponsor) => (
      <TableRow
        sponsor={sponsor}
        key={sponsor.get('_id')}
        disabled={disabled}
        onSelectRow={onSelectRow}
        isSelected={selectedRows.some((item) => item.getId() === sponsor.get('_id').toString())}
      />
    ))}
  </tbody>
);

TableBody.propTypes = {
  sponsors: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
  disabled: PropTypes.bool,
  onSelectRow: PropTypes.func.isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)),
};

TableBody.defaultProps = {
  sponsors: [],
  disabled: false,
  selectedRows: [],
};

export default TableBody;
