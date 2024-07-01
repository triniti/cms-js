import React from 'react';
import { Card, Table } from 'reactstrap';
import 'src/plugins/ncr/components/node-history-card-wip/revert-properties-table/styles.scss';
import TableRow from 'src/plugins/ncr/components/node-history-card-wip/revert-properties-table/TableRow.js';

const RevertPropertiesTable = ({
  data,
  isDbValueSameAsNodeValue,
  onSelectField: handleSelectField,
  node,
}) => (
  <Card className='m-0'>
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

export default RevertPropertiesTable;
