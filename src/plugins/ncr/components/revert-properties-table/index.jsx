/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Card, Table } from 'reactstrap';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import './styles.scss';
import TableRow from './TableRow';

const RevertPropertiesTable = ({
  data,
  isDbValueSameAsNodeValue,
  onSelectField: handleSelectField,
  node,
}) => (
  <Card>
    <Table striped responsive>
      <thead>
        <tr>
          <th className="select-col---revert-properties-table">
            Select
          </th>
          <th className="pl-3 left-col--revert-properties-table">
            Field
          </th>
          <th>
            Data
          </th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(data).map((property) => (
          !isDbValueSameAsNodeValue(property[0], property[1])
          && (
          <TableRow
            key={property[0]}
            property={property}
            node={node}
            onSelectField={handleSelectField}
          />
          )
        ))}
      </tbody>
    </Table>
  </Card>
);

RevertPropertiesTable.propTypes = {
  data: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  isDbValueSameAsNodeValue: PropTypes.func.isRequired,
  onSelectField: PropTypes.func.isRequired,
  node: PropTypes.instanceOf(Message).isRequired,
};

export default RevertPropertiesTable;