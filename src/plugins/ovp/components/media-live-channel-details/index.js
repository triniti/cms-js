import React from 'react';
import { Table } from 'reactstrap';

export default function MediaLiveChannelDetails(props) {
  const { node, medialive } = props;

  return (
    <Table>
      <tbody>
        <tr>
          <th className="nowrap" scope="row">Channel ARN:</th>
          <td className="w-100 text-break">{node.get('medialive_channel_arn')}</td>
        </tr>
        {medialive.inputs.map((value, index) => (
          <tr key={`input-${value}-${index}`}>
            <th className="nowrap" scope="row">Ingest Endpoint #{index + 1}:</th>
            <td className="w-100 text-break">{value}</td>
          </tr>
        ))}
        {medialive.originEndpoints.map((value, index) => (
          <tr key={`origin-${value}-${index}`}>
            <th className="nowrap" scope="row">Origin Endpoint #{index + 1}:</th>
            <td className="w-100 text-break">{value}</td>
          </tr>
        ))}
        {medialive.cdnEndpoints.map((value, index) => (
          <tr key={`cdn-${value}-${index}`}>
            <th className="nowrap" scope="row">CDN Endpoint #{index + 1}:</th>
            <td className="w-100 text-break">{value}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

