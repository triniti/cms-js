import React from 'react';
import { Button, Card, CardBody, CardHeader, Table } from 'reactstrap';
import { ActionButton } from '@triniti/cms/components/index';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import { Link } from 'react-router-dom';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl';
import { Icon } from '@triniti/cms/components';
import swal from 'sweetalert2';
import StartChannelV1 from '@triniti/schemas/triniti/ovp.medialive/command/StartChannelV1';
import { getInstance } from '@app/main';
import StopChannelV1 from '@triniti/schemas/triniti/ovp.medialive/command/StopChannelV1';
import progressIndicator from '@triniti/cms/utils/progressIndicator';
import MedialiveChannelStateButton from './MedialiveChannelStateButton';
import sendAlert from '@triniti/cms/actions/sendAlert';
import { useDispatch } from 'react-redux';

const statusColorMap = Object.values(NodeStatus).reduce((acc, cur) => {
  acc[cur.toString()] = cur.toString();
  return acc;
}, {});

const delay = (s) => new Promise((resolve) => setTimeout(resolve, s));

const LivestreamsCard = ({ nodes, metas, reloadChannelState }) => nodes.map((node, id) => {
  const app = getInstance();
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

  const dispatch = useDispatch();
  const policy = usePolicy();
  const canViewIngests = policy.isGranted(`${APP_VENDOR}:ovp.medialive:command:stop-channel`);
  const nodeRef = NodeRef.fromNode(node).toString();
  const mediaLiveData = {};

  Object.entries(metas).forEach(([key, value]) => {
    if (!MEDIA_REGEX.test(key)) {
      return;
    }

    if (MEDIALIVE_CHANNEL_REGEX.test(key)) {
      const nodeRef = key.replace(MEDIALIVE_CHANNEL_REGEX, '');
      mediaLiveData[nodeRef] = mediaLiveData[nodeRef] ? { ...mediaLiveData[nodeRef] } : {};
      mediaLiveData[nodeRef].state = value;
    }else if (MEDIAPACKAGE_ORIGIN_ENDPOINT_REGEX.test(key)) {
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

  const copyToClipboard = (str) => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  const handleStartChannels = async (nodeRef) => {
    await progressIndicator.show('Starting Channel...');
    try {
      const command = StartChannelV1.create()
        .set('node_ref', nodeRef);
      const pbjx = await app.getPbjx();
      await pbjx.send(command);
      await delay(5000);
      reloadChannelState();
      await progressIndicator.close();
      await delay(2000);
      dispatch(sendAlert({
       type: 'success',
       isDismissible: true,
       delay: 3000,
       message: 'Success! The MediaLive Channel was started.',
      }));
    }catch(error){
      await progressIndicator.close();
      console.error(error);
    }
  }

  const handleStopChannels = async (nodeRef, channelState) => {
    await swal.fire({
      icon: 'warning',
      titleText: 'Are you sure you want to stop the channel?',
      text: 'To stream again, you will have to stop the encoders, restart the channel, and then restart the encoders.',
      confirmButtonText: 'Continue',
      showCancelButton: true,
    }).then(async (result) => {
      if (result.value) {
        await progressIndicator.show('Stopping Channel...');
        const command = StopChannelV1.create()
          .set('node_ref', nodeRef);
        const pbjx = await app.getPbjx();
        await pbjx.send(command);
        await delay(5000);
        reloadChannelState();
        await progressIndicator.close();
        await delay(2000);
        dispatch(sendAlert({
          type: 'success',
          isDismissible: true,
          delay: 3000,
          message: 'Success! The MediaLive Channel was stopped.',
        }));
      }
    });
  }

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
        <p>
          <MedialiveChannelStateButton
          channelState={mediaLiveData[nodeRef].state}
          handleStartChannels={()=>handleStartChannels(NodeRef.fromNode(node))}
          handleStopChannels={()=>handleStopChannels(NodeRef.fromNode(node))} />
        </p>
        <Table responsive>
          <tbody>
          {kalturaEntryId && (
            <tr>
              <th>
                <ActionButton
                  className="mb-1"
                  color="hover"
                  id={`copy-to-clipboard-${node.get('_id')}-kaltura-entry-id`}
                  onClick={() => copyToClipboard(kalturaEntryId)}
                  icon="clipboard"
                  size="xs"
                  text=""
                />
                Kaltura Entry ID:
              </th>
              <td>{kalturaEntryId}</td>
            </tr>
          )}
          <tr>
            <th>
              <ActionButton
                className="mb-1"
                color="hover"
                id={`copy-to-clipboard-${node.get('_id')}-medialive-channel-rn`}
                onClick={() => copyToClipboard(channelArn)}
                icon="clipboard"
                size="xs"
                text=""
              />
              MediaLive Channel ARN:</th>
            <td>{channelArn}</td>
          </tr>
          {!mediaLiveData[nodeRef].originEndpoints.length && (
            <p>no origin endpoints found - is the channel arn correct?</p>
          )}
          {mediaLiveData[nodeRef].originEndpoints.length > 0 && mediaLiveData[nodeRef].originEndpoints.map((originEndpoint, index) => (
            <tr key={index}>
              <th className="pl-0">
                <ActionButton
                  className="mb-1"
                  color="hover"
                  id={`copy-to-clipboard-${node.get('_id')}-origin-endpoint-${index}`}
                  onClick={() => copyToClipboard(originEndpoint)}
                  icon="clipboard"
                  size="xs"
                  text=""
                />
                {`Origin Endpoint #${index + 1}: `}</th>
              <td>{originEndpoint}</td>
            </tr>
          ))}
          {!mediaLiveData[nodeRef].cdnEndpoints.length && (
            <p>no cdn endpoints found - is the channel arn correct?</p>
          )}
          {mediaLiveData[nodeRef].cdnEndpoints.length > 0 && mediaLiveData[nodeRef].cdnEndpoints.map((cdnEndpoint, index) => (
            <tr key={index}>
              <th className="pl-0">
                <ActionButton
                  className="mb-1"
                  color="hover"
                  id={`copy-to-clipboard-${node.get('_id')}-cdn-endpoint-${index}`}
                  onClick={() => copyToClipboard(cdnEndpoint)}
                  icon="clipboard"
                  size="xs"
                  text=""
                />
                {`CDN Endpoint #${index + 1}: `}</th>
              <td>{cdnEndpoint}</td>
            </tr>
          ))}
          {canViewIngests && !mediaLiveData[nodeRef].inputs.length && (
            <p>no inputs found - is the channel arn correct?</p>
          )}
          {mediaLiveData[nodeRef].inputs.length > 0 && mediaLiveData[nodeRef].inputs.map((input, index) => (
            <tr key={index}>
              <th className="pl-0">
                <ActionButton
                  className="mb-1"
                  color="hover"
                  id={`copy-to-clipboard-${node.get('_id')}-ingest-${index}`}
                  onClick={() => copyToClipboard(input)}
                  icon="clipboard"
                  size="xs"
                  text=""
                />
                {`Ingest Endpoint #${index + 1}: `}</th>
              <td>{input}</td>
            </tr>
          ))}
          </tbody>
        </Table>
        <p><a href="https://players.akamai.com/hls/" target="_blank" rel="noopener noreferrer"><strong>Demo Player</strong></a></p>
      </CardBody>
    </Card>
  );
});

export default LivestreamsCard;
