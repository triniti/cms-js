import React from 'react';
import { Card, Table } from '@triniti/admin-ui-plugin/components';
import TableBody from './TableBody';
import TableHeader from './TableHeader';

export default ({ nodes }) => (
  <Card>
    <Table>
      <TableHeader />
      <TableBody nodes={nodes} />
    </Table>
  </Card>
);
