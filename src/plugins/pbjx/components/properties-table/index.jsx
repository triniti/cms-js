/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Card, Table } from '@triniti/admin-ui-plugin/components';
import PropTypes from 'prop-types';
import './styles.scss';
import TableRow from './TableRow';

const PropertiesTable = ({ data }) => (
    <Card>
      <Table striped responsive>
        <thead>
          <tr>
            <th className="pl-3 left-col--properties-table">
              Field
            </th>
            <th className="right-col--properties-table">
              Data
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map((property, idx) => (
            <TableRow
              key={idx}
              property={property}
            />
          ))}
        </tbody>
      </Table>
    </Card>
);

PropertiesTable.propTypes = {
  data: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default PropertiesTable;
