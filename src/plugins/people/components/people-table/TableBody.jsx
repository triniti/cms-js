import React from 'react';
import PropTypes from 'prop-types';

import Message from '@gdbots/pbj/Message';

import TableRow from './TableRow';

const TableBody = ({
  disabled, onSelectRow, people, selectedRows,
}) => (
  <tbody>
    {people.map((person) => (
      <TableRow
        isSelected={selectedRows.some((item) => item.getId() === person.get('_id').toString())}
        key={person.get('_id')}
        disabled={disabled}
        onSelectRow={onSelectRow}
        person={person}
      />
    ))}
  </tbody>
);

TableBody.propTypes = {
  people: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
  disabled: PropTypes.bool,
  onSelectRow: PropTypes.func.isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.object),
};

TableBody.defaultProps = {
  people: [],
  disabled: false,
  selectedRows: [],
};

export default TableBody;
