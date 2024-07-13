import React from 'react';
import { Badge, Button, Card, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Icon } from '@triniti/cms/components/index.js';
import formatBytes from '@triniti/cms/utils/formatBytes.js';
import formatDate from '@triniti/cms/utils/formatDate.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';

export default function AssetTable(props) {
  const { nodes, onSelectAsset } = props;

  return (
    <Card>
      <Table hover responsive>
        <thead>
        <tr>
          <th>Title</th>
          <th>Mime Type</th>
          <th>File Size</th>
          <th>Created At</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        {nodes.map(node => {
          const nodeRef = node.generateNodeRef();
          const transcodingStatus = `${node.get('transcoding_status', '')}`;
          const handleRowClick = (e) => {
            // Do nothing if element contains `data-ignore-row-click` attribute
            if (e.target.closest('[data-ignore-row-click]')) {
              return;
            }

            onSelectAsset(nodeRef);
          }

          return (
            <tr key={`${node.get('_id')}`} className={`status-${node.get('status')} cursor-pointer`} onClick={handleRowClick}>
              <td>
                {node.get('title')}
                {transcodingStatus && (
                  <Badge pill className={`ms-1 status-${transcodingStatus}`}>Transcoding:{transcodingStatus}</Badge>
                )}
              </td>
              <td className="text-nowrap">{node.get('mime_type')}</td>
              <td>{formatBytes(node.get('file_size'))}</td>
              <td className="text-nowrap">{formatDate(node.get('created_at'))}</td>
              <td className="td-icons" data-ignore-row-click>
                <Link to={nodeUrl(node, 'view')} target="_blank" rel="noopener noreferrer">
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
    </Card>
  );
}
