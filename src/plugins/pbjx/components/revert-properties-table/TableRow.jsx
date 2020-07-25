import PropTypes from 'prop-types';
import React from 'react';
import { Checkbox } from '@triniti/admin-ui-plugin/components';
import Message from '@gdbots/pbj/Message';
import ValueRenderer from '../event-stream/ValueRenderer';

class TableRow extends React.Component {
  static propTypes = {
    isFieldSelected: PropTypes.func.isRequired,
    node: PropTypes.instanceOf(Message).isRequired,
    onSelectField: PropTypes.func.isRequired,
    property: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  constructor(props) {
    super(props);
    const {
      node,
      onSelectField: handleSelectField,
      property: [label],
    } = this.props;

    handleSelectField(label, node.get(label), true);
  }

  render() {
    const {
      isFieldSelected,
      node,
      onSelectField: handleSelectField,
      property: [label, value],
    } = this.props;
    return (
      <tr>
        <th scope="row" className="pl-3 left-col--properties-table" style={{ borderColor: '#efefef' }}>
          <Checkbox
            id={label}
            checked={isFieldSelected(label)}
            onChange={({ target: { checked } }) => { handleSelectField(label, node.get(label), checked); }}
            size="sd"
          />
        </th>
        <th scope="row" className="pl-3 left-col--properties-table" style={{ borderColor: '#efefef' }}>{label}</th>
        <td style={{ borderColor: '#efefef' }}><ValueRenderer value={value} /></td>
      </tr>
    );
  }
}

export default TableRow;
