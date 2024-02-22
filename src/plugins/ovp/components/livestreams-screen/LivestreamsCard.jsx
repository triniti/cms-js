import React, { lazy } from 'react';
import { Button, Card, CardBody, CardHeader, Table } from 'reactstrap';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import usePolicy from 'plugins/iam/components/usePolicy';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import { getInstance } from '@triniti/demo/src/main';
import { Link } from 'react-router-dom';
import nodeUrl from 'plugins/ncr/nodeUrl';
import { Icon } from 'components';

const statusColorMap = Object.values(NodeStatus).reduce((acc, cur) => {
  acc[cur.toString()] = cur.toString();
  return acc;
}, {});


const LivestreamsCard = ({ nodes, metas }) => nodes.map((node, id) => {
    const status = node.get('status').toString();
    const kalturaEntryId = node.get('kaltura_entry_id');
    const channelArn = node.get('medialive_channel_arn');
    const title = node.isInMap('tags', 'livestream_label')
      ? `${node.getFromMap('tags', 'livestream_label')} | ${node.get('title')}`
      : node.get('title');

    const MEDIA_REGEX = /\.media(live|package).+$/;
    const MEDIALIVE_CHANNEL_REGEX = /\.medialive_channel_state$/;
    const MEDIALIVE_INPUT_REGEX = /\.medialive_input_\d+$/;
    const MEDIAPACKAGE_ORIGIN_ENDPOINT_REGEX = /\.mediapackage_origin_endpoint_\d+$/;
    const MEDIAPACKAGE_CDN_ENDPOINT_REGEX = /\.mediapackage_cdn_endpoint_\d+$/;

  const nodeRef = NodeRef.fromNode(node).toString();
  const mediaLiveData = {};


  Object.entries(metas).forEach(([key, value]) => {
    if (!MEDIA_REGEX.test(key)) {
      return;
    }

    if (MEDIAPACKAGE_ORIGIN_ENDPOINT_REGEX.test(key)) {
      const nodeRef = key.replace(MEDIAPACKAGE_ORIGIN_ENDPOINT_REGEX, '');
      if(!mediaLiveData[nodeRef]) {
        mediaLiveData[nodeRef] = {};
      }
      if(!mediaLiveData[nodeRef].originEndpoints) {
        mediaLiveData[nodeRef].originEndpoints = [];
      }
      if (!mediaLiveData[nodeRef].originEndpoints.includes(value)) {
        mediaLiveData[nodeRef].originEndpoints.push(value);
      }
    } else if (MEDIAPACKAGE_CDN_ENDPOINT_REGEX.test(key)) {
      const nodeRef = key.replace(MEDIAPACKAGE_CDN_ENDPOINT_REGEX, '');
      if(!mediaLiveData[nodeRef]) {
        mediaLiveData[nodeRef] = {};
      }
      if(!mediaLiveData[nodeRef].cdnEndpoints) {
        mediaLiveData[nodeRef].cdnEndpoints = [];
      }
      if (!mediaLiveData[nodeRef].cdnEndpoints.includes(value)) {
        mediaLiveData[nodeRef].cdnEndpoints.push(value);
      }
    }else if (MEDIALIVE_INPUT_REGEX.test(key)) {
      const nodeRef = key.replace(MEDIALIVE_INPUT_REGEX, '');
      if(!mediaLiveData[nodeRef]) {
        mediaLiveData[nodeRef] = {};
      }
      if(!mediaLiveData[nodeRef].inputs) {
        mediaLiveData[nodeRef].inputs = [];
      }
      if (!mediaLiveData[nodeRef].inputs.includes(value)) {
        mediaLiveData[nodeRef].inputs.push(value);
      }
    }

  });

    return (
      <Card key={id}>
        <CardHeader> <span >
          <small className={`text-uppercase status-copy ml-0 mr-2 status-${statusColorMap[status]}`}>{status}</small>{title}
        </span>
          <span>
          <Link to={nodeUrl(node, 'view')}>
            <Button color="hover">
              <Icon imgSrc="eye" alt="view" />
            </Button>
          </Link>
            <Link to={nodeUrl(node, 'edit')}>
              <Button color="hover">
                <Icon imgSrc="pencil" alt="edit" />
              </Button>
            </Link>
          <a href={nodeUrl(node, 'canonical')} target="_blank" rel="noopener noreferrer">
            <Button color="hover">
              <Icon imgSrc="external" alt="open" />
            </Button>
          </a>
            </span>
        </CardHeader>
        <CardBody>
          <Table striped responsive>
          <tbody>
          {kalturaEntryId && (
            <tr>
              <th>Kaltura Entry ID:</th>
              <td>{kalturaEntryId}</td>
            </tr>
            )}
            <tr>
            <th>MediaLive Channel ARN:</th>
            <td>{channelArn}</td>
          </tr>
          {!mediaLiveData[nodeRef].originEndpoints.length && (
            <p>no origin endpoints found - is the channel arn correct?</p>
          )}
          {mediaLiveData[nodeRef].originEndpoints.length > 0 && mediaLiveData[nodeRef].originEndpoints.map((originEndpoint, index) => (
            <tr>
              <th>{`Origin Endpoint #${index + 1}: `}</th>
              <td>{originEndpoint}</td>
            </tr>
          ))}
          {!mediaLiveData[nodeRef].cdnEndpoints.length && (
            <p>no cdn endpoints found - is the channel arn correct?</p>
          )}
          {mediaLiveData[nodeRef].cdnEndpoints.length > 0 && mediaLiveData[nodeRef].cdnEndpoints.map((cdnEndpoint, index) => (
            <tr>
              <th>{`CDN Endpoint #${index + 1}: `}</th>
              <td>{cdnEndpoint}</td>
            </tr>
          ))}

          {!mediaLiveData[nodeRef].inputs.length && (
            <p>no inputs found - is the channel arn correct?</p>
          )}
          {mediaLiveData[nodeRef].inputs.length > 0 && mediaLiveData[nodeRef].inputs.map((cdnEndpoint, index) => (
            <tr>
              <th>{`Ingest Endpoint #${index + 1}: `}</th>
              <td>{cdnEndpoint}</td>
            </tr>
          ))}

          </tbody>
          </Table>
        </CardBody>
      </Card>
    );
  });

export default LivestreamsCard;
