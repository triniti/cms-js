import React from 'react';
// import Message from '@gdbots/pbj/Message';
// import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { Card, Table } from '@triniti/admin-ui-plugin/components';
import PropTypes from 'prop-types';

import TableRow from './TableRow';
// import TableBody from './TableBody';
// import EventJsonTree from "../event-stream/EventJsonTree";

const PropertiesTable = ({ data }) => {
  const properties = Object.entries(data);
  return (
    <Card>
      <Table className="table-striped" hover responsive>
        <thead>
          <tr>
            <th>
              Field
            </th>
            <th>
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
}

PropertiesTable.propTypes = {
  data: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default PropertiesTable;
