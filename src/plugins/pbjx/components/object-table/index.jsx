import React from 'react';
import { Table } from '@triniti/admin-ui-plugin/components';
import PropTypes from 'prop-types';
import TableRow from './TableRow';

const ObjectTable = ({ data }) => {
  const properties = Object.entries(data);
  return (
    <Table className="table-sm table-borderless">
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

ObjectTable.propTypes = {
  data: PropTypes.instanceOf(Object).isRequired, // eslint-disable-line react/forbid-prop-types
};

export default ObjectTable;
