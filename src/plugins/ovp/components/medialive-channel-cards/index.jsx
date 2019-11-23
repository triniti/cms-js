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
  console.log(node);
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
      <CardBody className="pb-1">
        <MediaLiveChannelStatusButton node={node} size="sm" />
        <p className="mt-3"><strong>MediaLive Channel ARN:</strong> {node.get('medialive_channel_arn')}</p>
        <p><strong>Live m3u8 URL:</strong> {node.get('live_m3u8_url', 'todo: add m3u8 url')}</p>
        <p><strong>CDN m3u8 URL:</strong> {node.get('live_m3u8_url', 'todo: add cdn url')}</p>
        <p><strong>MediaLive Input Ingest #1:</strong> todo: add ingest #1</p>
        <p><strong>MediaLive Input Ingest #2:</strong> todo: add ingest #2</p>
        <p><a href="https://players.akamai.com/hls/" target="_blank" rel="noopener noreferrer"><strong>Demo Player</strong></a></p>
      </CardBody>
    </Card>
  );
});
