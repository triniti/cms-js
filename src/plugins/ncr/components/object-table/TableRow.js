import React from 'react';
import ValueRenderer from '@triniti/cms/plugins/ncr/components/revert-properties-table/ValueRenderer.js';
import '@triniti/cms/plugins/ncr/components/object-table/styles.scss';

const TableRow = ({ property: [label, value] }) => (
  <tr className="bg-none">
    <th scope="row">{label}</th><td><ValueRenderer value={value} /></td>
  </tr>
);

export default TableRow;
