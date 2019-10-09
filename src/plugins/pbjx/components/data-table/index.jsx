import React from 'react';
import { Table } from '@triniti/admin-ui-plugin/components';
import PropTypes from 'prop-types';
import TableRow from './TableRow';

const DataTable = ({ data }) => {
  const properties = Object.entries(data);
  return (
    <Table className="table-bordered table-sm">
      <tbody>
        {properties.map((property, idx) => (
          <TableRow
            key={idx}
            property={property}
          />
        ))}
      </tbody>
    </Table>
  );
}

DataTable.propTypes = {
  data: PropTypes.instanceOf(Object).isRequired, // eslint-disable-line react/forbid-prop-types
};

export default DataTable;
