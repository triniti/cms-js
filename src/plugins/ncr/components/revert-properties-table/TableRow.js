import React from 'react';
import { Input } from 'reactstrap';
import ValueRenderer from '@triniti/cms/plugins/ncr/components/revert-properties-table/ValueRenderer.js';

const TableRow = ({
  node,
  onSelectField: handleSelectField,
  property: [label, value],
}) => {

  return (
    <tr>
      <th scope="row" className="pl-3 left-col--properties-table" style={{ borderColor: '#efefef' }}>
        <Input
          id={label}
          onChange={({ target: { checked } }) => { handleSelectField(label, node.get(label), checked); }}
          bsSize="sd"
          type="checkbox"
        />
      </th>
      <th scope="row" className="pl-3 left-col--properties-table" style={{ borderColor: '#efefef' }}>{label}</th>
      <td style={{ borderColor: '#efefef' }}><ValueRenderer value={value} /></td>
    </tr>
  );
}

export default TableRow;
