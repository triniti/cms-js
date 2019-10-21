/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Card, Table } from '@triniti/admin-ui-plugin/components';
import PropTypes from 'prop-types';
import './styles.scss';
import TableRow from './TableRow';

const PropertiesTable = ({ data }) => {
  const properties = Object.entries(data);

  return (
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
          {properties.map((property, idx) => (
            <TableRow
              key={idx}
              property={property}
            />
          ))}
        </tbody>
      </Table>
    </Card>
  );
};

PropertiesTable.propTypes = {
  data: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default PropertiesTable;
