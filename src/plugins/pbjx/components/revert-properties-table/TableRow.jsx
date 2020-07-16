import PropTypes from 'prop-types';
import React from 'react';
import { Checkbox } from '@triniti/admin-ui-plugin/components';
import ValueRenderer from '../event-stream/ValueRenderer';

class TableRow extends React.Component {
  static propTypes = {
    property: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    isFieldSelected: PropTypes.func.isRequired,
    onSelectField: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const {
      property: [label, value],
      onSelectField: handleSelectField,
    } = this.props;

    handleSelectField(label, value, true);
  }

  render() {
    const {
      property: [label, value],
      isFieldSelected,
      onSelectField: handleSelectField,
    } = this.props;
    return (
      <tr>
        <th scope="row" className="pl-3 left-col--properties-table" style={{ borderColor: '#efefef' }}>
          <Checkbox size="sd" id={label} checked={isFieldSelected(label)} onChange={({ target: { checked } }) => { handleSelectField(label, value, checked); }} />
        </th>
        <th scope="row" className="pl-3 left-col--properties-table" style={{ borderColor: '#efefef' }}>{label}</th>
        <td style={{ borderColor: '#efefef' }}><ValueRenderer value={value} /></td>
      </tr>
    );
  }
}

export default TableRow;
