import PropTypes from 'prop-types';
import React from 'react';
import ValueRenderer from '../event-stream/ValueRenderer';

const TableRow = ({ property: [label, value] }) => (
  <tr>
    <th scope="row" className="pl-3 left-col--properties-table" style={{ borderColor: '#efefef' }}>{label}</th>
    <td style={{ borderColor: '#efefef' }}><ValueRenderer value={value} /></td>
  </tr>
);

TableRow.propTypes = {
  property: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default TableRow;
