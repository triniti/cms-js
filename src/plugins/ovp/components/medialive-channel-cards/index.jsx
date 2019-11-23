import copyToClipboard from '@triniti/cms/utils/copyToClipboard';
import MediaLiveChannelStatusButton from '@triniti/cms/plugins/ovp/components/medialive-channel-status-button';
import pbjUrl from '@gdbots/pbjx/pbjUrl';
import React from 'react';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Icon,
  RouterLink,
} from '@triniti/admin-ui-plugin/components';
import './styles.scss';

export default ({ nodes }) => nodes.map((node) => {
  const channelArn = node.get('medialive_channel_arn');
  const liveM3u8Url = node.get('live_m3u8_url', 'todo: add m3u8 url');
  const cdnM3u8Url = 'todo: add cdn url';
  const ingest1 = 'todo: add ingest #1';
  const ingest2 = 'todo: add ingest #2';
  return (
    <Card key={node.get('_id')}>
      <CardHeader className="pr-2">
        <p className="mb-0 mr-2 medialive-channel-card__header-text">{node.get('title')}</p>
        <RouterLink to={pbjUrl(node, 'cms')}>
          <Button id={`view-${node.get('_id')}`} color="hover" radius="circle" className="mb-0 mr-1">
            <Icon imgSrc="eye" alt="view" />
          </Button>
          <UncontrolledTooltip placement="auto" target={`view-${node.get('_id')}`}>View</UncontrolledTooltip>
        </RouterLink>
        <RouterLink to={`${pbjUrl(node, 'cms')}/edit`}>
          <Button id={`edit-${node.get('_id')}`} color="hover" radius="circle" className="mb-0 mr-1">
            <Icon imgSrc="pencil" alt="edit" />
          </Button>
          <UncontrolledTooltip placement="auto" target={`edit-${node.get('_id')}`}>Edit</UncontrolledTooltip>
        </RouterLink>
        <a
          href={pbjUrl(node, 'canonical')}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button color="hover" id={`open-in-new-tab-${node.get('_id')}`} radius="circle" className="mr-1 mb-0">
            <Icon imgSrc="external" alt="open" />
          </Button>
          <UncontrolledTooltip placement="auto" target={`open-in-new-tab-${node.get('_id')}`}>Open in new tab</UncontrolledTooltip>
        </a>
      </CardHeader>
      <CardBody className="pb-3">
        <MediaLiveChannelStatusButton node={node} size="sm" />
        <div className="mt-3 mb-2 d-flex align-items-center">
          <p className="mb-1"><strong>MediaLive Channel ARN: </strong>{channelArn}</p>
          <Button
            className="mb-1 ml-2"
            color="hover"
            id={`copy-to-clipboard-${node.get('_id')}-arn`}
            onClick={() => copyToClipboard(channelArn)}
            radius="circle"
            size="xs"
          >
            <Icon imgSrc="clipboard" alt="copy to clipboard" />
          </Button>
          <UncontrolledTooltip placement="auto" target={`copy-to-clipboard-${node.get('_id')}-arn`}>Copy to clipboard</UncontrolledTooltip>
        </div>
        <div className="mb-2 d-flex align-items-center">
          <p className="mb-1"><strong>Live m3u8 URL: </strong>{liveM3u8Url}</p>
          <Button
            className="mb-1 ml-2"
            color="hover"
            id={`copy-to-clipboard-${node.get('_id')}-live-m3u8`}
            onClick={() => copyToClipboard(liveM3u8Url)}
            radius="circle"
            size="xs"
          >
            <Icon imgSrc="clipboard" alt="copy to clipboard" />
          </Button>
          <UncontrolledTooltip placement="auto" target={`copy-to-clipboard-${node.get('_id')}-live-m3u8`}>Copy to clipboard</UncontrolledTooltip>
        </div>
        <div className="mb-2 d-flex align-items-center">
          <p className="mb-1"><strong>CDN m3u8 URL: </strong>{cdnM3u8Url}</p>
          <Button
            className="mb-1 ml-2"
            color="hover"
            id={`copy-to-clipboard-${node.get('_id')}-cdn-m3u8`}
            onClick={() => copyToClipboard(cdnM3u8Url)}
            radius="circle"
            size="xs"
          >
            <Icon imgSrc="clipboard" alt="copy to clipboard" />
          </Button>
          <UncontrolledTooltip placement="auto" target={`copy-to-clipboard-${node.get('_id')}-cdn-m3u8`}>Copy to clipboard</UncontrolledTooltip>
        </div>
        <div className="mb-2 d-flex align-items-center">
          <p className="mb-1"><strong>RTMP Ingest Endpoint #1: </strong>{ingest1}</p>
          <Button
            className="mb-1 ml-2"
            color="hover"
            id={`copy-to-clipboard-${node.get('_id')}-ingest-1`}
            onClick={() => copyToClipboard(ingest1)}
            radius="circle"
            size="xs"
          >
            <Icon imgSrc="clipboard" alt="copy to clipboard" />
          </Button>
          <UncontrolledTooltip placement="auto" target={`copy-to-clipboard-${node.get('_id')}-ingest-1`}>Copy to clipboard</UncontrolledTooltip>
        </div>
        <div className="mb-2 d-flex align-items-center">
          <p className="mb-1"><strong>RTMP Ingest Endpoint #2: </strong>{ingest2}</p>
          <Button
            className="mb-1 ml-2"
            color="hover"
            id={`copy-to-clipboard-${node.get('_id')}-ingest-2`}
            onClick={() => copyToClipboard(ingest2)}
            radius="circle"
            size="xs"
          >
            <Icon imgSrc="clipboard" alt="copy to clipboard" />
          </Button>
          <UncontrolledTooltip placement="auto" target={`copy-to-clipboard-${node.get('_id')}-ingest-2`}>Copy to clipboard</UncontrolledTooltip>
        </div>
        <p className="m-0"><a href="https://players.akamai.com/hls/" target="_blank" rel="noopener noreferrer"><strong>Demo Player</strong></a></p>
      </CardBody>
    </Card>
  );
});
