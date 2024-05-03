import React from 'react';
import ValueRenderer from '../revert-properties-table/ValueRenderer.js';
import './styles.scss';

const TableRow = ({ property: [label, value] }) => (
  <tr className="bg-none">
    <th scope="row">{label}</th><td><ValueRenderer value={value} /></td>
  </tr>
);

export default TableRow;
