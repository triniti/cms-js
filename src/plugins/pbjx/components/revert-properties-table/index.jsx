/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Card, Table } from '@triniti/admin-ui-plugin/components';
import PropTypes from 'prop-types';
import './styles.scss';
import TableRow from './TableRow';

const RevertPropertiesTable = ({ data, isFieldSelected, onSelectField: handleSelectField }) => (
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
          <th className="right-col--revert-properties-table">
            Data
          </th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(data).map((property, idx) => (
          <TableRow
            isFieldSelected={isFieldSelected}
            onSelectField={handleSelectField}
            key={idx}
            property={property}
          />
        ))}
      </tbody>
    </Table>
  </Card>
);

RevertPropertiesTable.propTypes = {
  data: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  isFieldSelected: PropTypes.func.isRequired,
  onSelectField: PropTypes.func.isRequired,
};

export default RevertPropertiesTable;
