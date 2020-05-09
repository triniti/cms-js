import PropTypes from 'prop-types';
import React from 'react';
import ValueRenderer from '../event-stream/ValueRenderer';
import { Checkbox } from '@triniti/admin-ui-plugin/components';

const TableRow = ({ property: [label, value], onChangeCheckbox: handleChangeCheckbox }) => (
  <tr>
    <th scope="row" className="pl-3 left-col--properties-table" style={{ borderColor: '#efefef' }}><Checkbox size="sd" id={label} onChange={handleChangeCheckbox} value={value} /></th>
    <th scope="row" className="pl-3 left-col--properties-table" style={{ borderColor: '#efefef' }}>{label}</th>
    <td style={{ borderColor: '#efefef' }}><ValueRenderer value={value} /></td>
  </tr>
);

TableRow.propTypes = {
  property: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  onChangeCheckbox: PropTypes.func.isRequired,
};

export default TableRow;
