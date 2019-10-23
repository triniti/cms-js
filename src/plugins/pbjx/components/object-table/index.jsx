/* eslint-disable import/no-cycle */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Table } from '@triniti/admin-ui-plugin/components';
import PropTypes from 'prop-types';
import TableRow from './TableRow';

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

ObjectTable.propTypes = {
  data: PropTypes.instanceOf(Object).isRequired, // eslint-disable-line react/forbid-prop-types
};

export default ObjectTable;
