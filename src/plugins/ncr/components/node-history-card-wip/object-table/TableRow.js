import React from 'react';
import ValueRenderer from 'src/plugins/ncr/components/node-history-card-wip/revert-properties-table/ValueRenderer.js';
import 'src/plugins/ncr/components/node-history-card-wip/object-table/styles.scss';

const TableRow = ({ property: [label, value] }) => (
  <tr className="bg-none">
    <th scope="row">{label}</th><td><ValueRenderer value={value} /></td>
  </tr>
);

export default TableRow;
