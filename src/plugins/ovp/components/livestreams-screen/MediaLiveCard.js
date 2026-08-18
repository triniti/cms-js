import React from 'react';
import { Badge, Button, Card, CardBody, CardHeader, Spinner, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Icon } from '@triniti/cms/components/index.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import MediaLiveChannelControls, { processMedialiveMetas } from '@triniti/cms/plugins/ovp/components/media-live-channel-controls/index.js';

export default function MediaLiveCard(props) {
  const { node, nodeRef, metas, refresh, isRefreshing } = props;
  const policy = usePolicy();
  const nodeStatus = node.get('status').getValue();
  const canUpdateVideo = policy.isGranted(`${APP_VENDOR}:video:update`);
  const medialive = processMedialiveMetas(metas, nodeRef);

  return (
    <Card>
      <CardHeader>
        <div className="w-100">
          {node.get('title')}{isRefreshing && <Spinner />}
          {node.isInMap('tags', 'livestream_label') && (
            <Badge color="light" className="ms-2">{node.getFromMap('tags', 'livestream_label')}</Badge>
          )}
          <Badge className={`status-${nodeStatus} ms-2`}>
            {nodeStatus}
          </Badge>
        </div>
        <div className="ms-auto text-nowrap">
          <Link to={nodeUrl(node, 'view')}>
            <Button color="hover" tag="span">
              <Icon imgSrc="eye" alt="view" />
            </Button>
          </Link>
          {canUpdateVideo && (
            <Link to={nodeUrl(node, 'edit')}>
              <Button color="hover" tag="span">
                <Icon imgSrc="pencil" alt="edit" />
              </Button>
            </Link>
          )}
          <a href={nodeUrl(node, 'canonical')} target="_blank" rel="noopener noreferrer">
            <Button color="hover" tag="span">
              <Icon imgSrc="external" alt="open" />
            </Button>
          </a>
        </div>
      </CardHeader>

      <CardBody className="p-2">
        <MediaLiveChannelControls
          nodeRef={nodeRef}
          metas={metas}
          refresh={refresh}
          isRefreshing={isRefreshing}
        />
        <Table>
          <tbody>
          <tr>
            <th className="nowrap" scope="row">Channel ARN:</th>
            <td className="w-100 text-break">{node.get('medialive_channel_arn')}</td>
          </tr>
          {medialive.inputs.map((value, index) => (
            <tr key={value}>
              <th className="nowrap" scope="row">Ingest Endpoint #{index + 1}:</th>
              <td className="w-100 text-break">{value}</td>
            </tr>
          ))}
          {medialive.originEndpoints.map((value, index) => (
            <tr key={value}>
              <th className="nowrap" scope="row">Origin Endpoint #{index + 1}:</th>
              <td className="w-100 text-break">{value}</td>
            </tr>
          ))}
          {medialive.cdnEndpoints.map((value, index) => (
            <tr key={value}>
              <th className="nowrap" scope="row">CDN Endpoint #{index + 1}:</th>
              <td className="w-100 text-break">{value}</td>
            </tr>
          ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
}

