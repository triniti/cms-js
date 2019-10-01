import React from 'react';
import PropTypes from 'prop-types';

import Message from '@gdbots/pbj/Message';

import TableRow from './TableRow';

const TableBody = ({
  disabled, pages, onSelectRow, selectedRows,
}) => (
  <tbody>
    {pages.map((page) => (
      <TableRow
        disabled={disabled}
        isSelected={selectedRows.some((item) => item.getId() === page.get('_id').toString())}
        key={page.get('_id')}
        onSelectRow={onSelectRow}
        page={page}
      />
    ))}
  </tbody>
);


TableBody.propTypes = {
  disabled: PropTypes.bool,
  onSelectRow: PropTypes.func.isRequired,
  pages: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
  selectedRows: PropTypes.arrayOf(PropTypes.object),
};

TableBody.defaultProps = {
  disabled: false,
  pages: [],
  selectedRows: [],
};

export default TableBody;
