import React from 'react';
import PropTypes from 'prop-types';

import Message from '@gdbots/pbj/Message';

import TableRow from './TableRow';

const TableBody = ({
  redirects, disabled, onSelectRow, selectedRows,
}) => (
  <tbody>
    {redirects.map((redirect) => (
      <TableRow
        redirect={redirect}
        key={redirect.get('_id')}
        disabled={disabled}
        onSelectRow={onSelectRow}
        isSelected={selectedRows.some((item) => item.getId() === redirect.get('_id').toString())}
      />
    ))}
  </tbody>
);

TableBody.propTypes = {
  redirects: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
  disabled: PropTypes.bool,
  onSelectRow: PropTypes.func.isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.object),
};

TableBody.defaultProps = {
  redirects: [],
  disabled: false,
  selectedRows: [],
};

export default TableBody;
