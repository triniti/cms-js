import { connect } from 'react-redux';
import classNames from 'classnames';
import copyToClipboard from '@triniti/cms/utils/copyToClipboard';
import get from 'lodash/get';
import MediaLiveChannelStateButton from '@triniti/cms/plugins/ovp/components/medialive-channel-state-button';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import pbjUrl from '@gdbots/pbjx/pbjUrl';
import PropTypes from 'prop-types';
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
import selector from './selector';
import './styles.scss';

const statusColorMap = Object.values(NodeStatus).reduce((acc, cur) => {
  acc[cur.toString()] = cur.toString();
  return acc;
}, {});

const MediaLiveChannelCards = ({ canViewIngests, getMediaLive, nodes }) => nodes.map((node) => {
  const status = node.get('status').toString();
  const kalturaEntryId = node.get('kaltura_entry_id');
  const channelArn = node.get('medialive_channel_arn');
  const mediaLiveData = getMediaLive(NodeRef.fromNode(node));
  const originEndpoints = get(mediaLiveData, 'originEndpoints', []);
  const cdnEndpoints = get(mediaLiveData, 'cdnEndpoints', []);
  const inputs = get(mediaLiveData, 'inputs', []);
  const title = node.isInMap('tags', 'livestream_label')
    ? `${node.getFromMap('tags', 'livestream_label')} | ${node.get('title')}`
    : node.get('title');
  return (
    <Card key={node.get('_id')}>
      <CardHeader className="pr-2">
        <small className={`text-uppercase status-copy ml-0 mr-2 status-${statusColorMap[status]}`}>
          {status}
        </small>
        <p className="mb-0 mr-2 medialive-channel-card__header-text">{title}</p>
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
        <MediaLiveChannelStateButton node={node} size="sm" />
        {kalturaEntryId && (
        <div className="mt-3 mb-2 d-flex align-items-center">
          <Button
            className="mb-1"
            color="hover"
            id={`copy-to-clipboard-${node.get('_id')}-kaltura-entry-id`}
            onClick={() => copyToClipboard(kalturaEntryId)}
            radius="circle"
            size="xs"
          >
            <Icon imgSrc="clipboard" alt="copy to clipboard" />
          </Button>
          <UncontrolledTooltip placement="auto" target={`copy-to-clipboard-${node.get('_id')}-kaltura-entry-id`}>Copy to clipboard</UncontrolledTooltip>
          <p className="mb-1"><strong>Kaltura Entry ID: </strong>{kalturaEntryId}</p>
        </div>
        )}
        <div className={classNames('mb-2 d-flex align-items-center', { 'mt-3': !kalturaEntryId })}>
          <Button
            className="mb-1"
            color="hover"
            id={`copy-to-clipboard-${node.get('_id')}-arn`}
            onClick={() => copyToClipboard(channelArn)}
            radius="circle"
            size="xs"
          >
            <Icon imgSrc="clipboard" alt="copy to clipboard" />
          </Button>
          <UncontrolledTooltip placement="auto" target={`copy-to-clipboard-${node.get('_id')}-arn`}>Copy to clipboard</UncontrolledTooltip>
          <p className="mb-1"><strong>MediaLive Channel ARN: </strong>{channelArn}</p>
        </div>
        {!originEndpoints.length ? (
          <p>no origin endpoints found - is the channel arn correct?</p>
        ) : (
          originEndpoints.map((originEndpoint, index) => {
            const tooltipTarget = `copy-to-clipboard-${node.get('_id')}-origin-endpoint-${index}`;
            return (
              <div className="mb-2 d-flex align-items-center" key={originEndpoint}>
                <Button
                  className="mb-1"
                  color="hover"
                  id={tooltipTarget}
                  onClick={() => copyToClipboard(originEndpoint)}
                  radius="circle"
                  size="xs"
                >
                  <Icon imgSrc="clipboard" alt="copy to clipboard" />
                </Button>
                <UncontrolledTooltip placement="auto" target={tooltipTarget}>Copy to clipboard</UncontrolledTooltip>
                <p className="mb-1"><strong>{`Origin Endpoint #${index + 1}: `}</strong>{originEndpoint}</p>
              </div>
            );
          })
        )}
        {!cdnEndpoints.length ? (
          <p>no cdn endpoints found - is the channel arn correct?</p>
        ) : (
          cdnEndpoints.map((cdnEndpoint, index) => {
            const tooltipTarget = `copy-to-clipboard-${node.get('_id')}-cdn-endpoint-${index}`;
            return (
              <div className="mb-2 d-flex align-items-center" key={cdnEndpoint}>
                <Button
                  className="mb-1"
                  color="hover"
                  id={tooltipTarget}
                  onClick={() => copyToClipboard(cdnEndpoint)}
                  radius="circle"
                  size="xs"
                >
                  <Icon imgSrc="clipboard" alt="copy to clipboard" />
                </Button>
                <UncontrolledTooltip placement="auto" target={tooltipTarget}>Copy to clipboard</UncontrolledTooltip>
                <p className="mb-1"><strong>{`CDN Endpoint #${index + 1}: `}</strong>{cdnEndpoint}</p>
              </div>
            );
          })
        )}
        {canViewIngests && (!inputs.length ? (
          <p>no inputs found - is the channel arn correct?</p>
        ) : (
          inputs.map((input, index) => {
            const tooltipTarget = `copy-to-clipboard-${node.get('_id')}-ingest-${index}`;
            return (
              <div className="mb-2 d-flex align-items-center" key={input}>
                <Button
                  className="mb-1"
                  color="hover"
                  id={tooltipTarget}
                  onClick={() => copyToClipboard(input)}
                  radius="circle"
                  size="xs"
                >
                  <Icon imgSrc="clipboard" alt="copy to clipboard" />
                </Button>
                <UncontrolledTooltip placement="auto" target={tooltipTarget}>Copy to clipboard</UncontrolledTooltip>
                <p className="mb-1"><strong>{`Ingest Endpoint #${index + 1}: `}</strong>{input}</p>
              </div>
            );
          })
        ))}
        <p className="m-0"><a href="https://players.akamai.com/hls/" target="_blank" rel="noopener noreferrer"><strong>Demo Player</strong></a></p>
      </CardBody>
    </Card>
  );
});

MediaLiveChannelCards.propTypes = {
  canViewIngests: PropTypes.bool.isRequired,
  getMediaLive: PropTypes.func.isRequired,
  nodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
};

MediaLiveChannelCards.defaultProps = {
  nodes: [],
};

export default connect(selector)(MediaLiveChannelCards);
