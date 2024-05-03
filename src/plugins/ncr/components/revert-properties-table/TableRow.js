import PropTypes from 'prop-types';
import React from 'react';
import { Input } from 'reactstrap';
import Message from '@gdbots/pbj/Message';
import ValueRenderer from './ValueRenderer';

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

TableRow.propTypes = {
  node: PropTypes.instanceOf(Message).isRequired,
  onSelectField: PropTypes.func.isRequired,
  property: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default TableRow;
