import React from 'react';
import { Badge, Button, Input, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Icon } from '@triniti/cms/components/index.js';
import formatBytes from '@triniti/cms/utils/formatBytes.js';
import formatDate from '@triniti/cms/utils/formatDate.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import AssetIcon from '@triniti/cms/plugins/dam/components/asset-icon/index.js';

export default function AssetTable(props) {
  const { nodes, batch } = props;

  return (
    <Table hover responsive>
      <thead>
      <tr>
        <th><Input type="checkbox" checked={batch.hasAll()} onChange={batch.toggleAll} /></th>
        <th style={{ width: '44px' }}></th>
        <th>Title</th>
        <th className="d-none d-sm-table-cell">Mime Type</th>
        <th className="d-none d-md-table-cell">File Size</th>
        <th className="d-none d-lg-table-cell">Created At</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      {nodes.map(node => {
        const transcodingStatus = `${node.get('transcoding_status', '')}`;
        return (
          <tr key={`${node.get('_id')}`} className={`status-${node.get('status')}`}>
            <td><Input type="checkbox" onChange={() => batch.toggle(node)} checked={batch.has(node)} /></td>
            <td className="text-center"><AssetIcon id={node.get('_id')} /></td>
            <td className="text-break w-100">
              {node.get('title')}
              {transcodingStatus && (
                <Badge pill className={`ms-1 status-${transcodingStatus}`}>Transcoding:{transcodingStatus}</Badge>
              )}
            </td>
            <td className="text-nowrap d-none d-sm-table-cell">{node.get('mime_type')}</td>
            <td className="d-none d-md-table-cell">{formatBytes(node.get('file_size'))}</td>
            <td className="text-nowrap d-none d-lg-table-cell">{formatDate(node.get('created_at'))}</td>
            <td className="td-icons">
              <Link to={nodeUrl(node, 'view')}>
                <Button color="hover" tag="span">
                  <Icon imgSrc="eye" alt="view" />
                </Button>
              </Link>
            </td>
          </tr>
        );
      })}
      </tbody>
    </Table>
  );
}
