import React from 'react';
import { Table } from 'reactstrap';
import ValueRenderer from '@triniti/cms/plugins/ncr/components/node-history-card/ValueRenderer.js';

export default function PropertiesTable({ data }) {
  return (
    <Table striped responsive>
      <thead>
      <tr>
        <th style={{ width: '200px' }}>Field</th>
        <th>Data</th>
      </tr>
      </thead>
      <tbody>
      {Object.entries(data).map(([label, value], idx) => (
        <tr key={idx}>
          <th>{label}</th>
          <td><ValueRenderer value={value} /></td>
        </tr>
      ))}
      </tbody>
    </Table>
  );
}
