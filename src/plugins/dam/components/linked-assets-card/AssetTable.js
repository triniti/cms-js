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
        <th>Mime Type</th>
        <th>File Size</th>
        <th>Created At</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      {nodes.map(node => {
        const transcodingStatus = node.get('transcoding_status');
        return (
          <tr key={`${node.get('_id')}`} className={`status-${node.get('status')}`}>
            <td><Input type="checkbox" onChange={() => batch.toggle(node)} checked={batch.has(node)} /></td>
            <td className="text-center"><AssetIcon id={node.get('_id')} /></td>
            <td>
              {node.get('title')}
              {transcodingStatus && (
                <Badge pill className={`ms-1 status-${transcodingStatus}`}>Transcoding:{transcodingStatus}</Badge>
              )}
            </td>
            <td className="text-nowrap">{node.get('mime_type')}</td>
            <td>{formatBytes(node.get('file_size'))}</td>
            <td className="text-nowrap">{formatDate(node.get('created_at'))}</td>
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
