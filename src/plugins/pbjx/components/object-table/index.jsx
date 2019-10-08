import React from 'react';
// import Message from '@gdbots/pbj/Message';
// import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { Card, Table } from '@triniti/admin-ui-plugin/components';
import PropTypes from 'prop-types';

import TableRow from './TableRow';
import Message from "@gdbots/pbj/Message";
// import TableBody from './TableBody';
// import EventJsonTree from "../event-stream/EventJsonTree";

const ObjectTable = ({ data }) => {
  const properties = Object.entries(data);
  return (
    <Table className="table-bordered table-sm">
      <tbody>
        {properties.map((property, idx) => (
          <TableRow
            key={idx}
            idx={idx}
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
