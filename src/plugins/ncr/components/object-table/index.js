import React from 'react';
import { Table } from 'reactstrap';
import TableRow from '@triniti/cms/plugins/ncr/components/object-table/TableRow.js';

const ObjectTable = ({ data }) => (
  <Table borderless size="sm" className="mb-0 table--object-table">
    <tbody>
      {Object.entries(data).map((property, idx) => (
        <TableRow
          key={idx}
          property={property}
        />
      ))}
    </tbody>
  </Table>
);

export default ObjectTable;
