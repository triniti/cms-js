/* eslint-disable import/no-cycle */
import PropTypes from 'prop-types';
import React from 'react';
import ValueRenderer from '../event-stream/ValueRenderer';
import './styles.scss';

const TableRow = ({ property: [label, value] }) => (
  <tr className="bg-none">
    <th scope="row">{label}</th><td><ValueRenderer value={value}/></td>
  </tr>
);

TableRow.propTypes = {
  property: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types

};

export default TableRow;
