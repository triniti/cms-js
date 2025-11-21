import React from 'react';
import Swal from 'sweetalert2';
import { Badge, Button, Card, CardBody, CardHeader, CardText, Label, Spinner, Table } from 'reactstrap';
import ChannelState from '@triniti/schemas/triniti/ovp.medialive/enums/ChannelState.js';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ActionButton, Icon } from '@triniti/cms/components/index.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import progressIndicator from '@triniti/cms/utils/progressIndicator.js';
import delay from '@triniti/cms/utils/delay.js';
import toast from '@triniti/cms/utils/toast.js';
import sendAlert from '@triniti/cms/actions/sendAlert.js';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';
import startMediaLiveChannel from '@triniti/cms/plugins/ovp/actions/startMediaLiveChannel.js';
import stopMediaLiveChannel from '@triniti/cms/plugins/ovp/actions/stopMediaLiveChannel.js';

export default function MediaLiveCard(props) {
  const { node, nodeRef, medialive, refresh, isRefreshing } = props;
  const dispatch = useDispatch();
  const policy = usePolicy();
  const nodeStatus = node.get('status').getValue();

  const isIdle = medialive.channelState === ChannelState.IDLE.getValue();
  const isRunning = medialive.channelState === ChannelState.RUNNING.getValue();
  const canUpdateVideo = policy.isGranted(`${APP_VENDOR}:video:update`);
  const canStartChannel = !isRefreshing && isIdle && policy.isGranted('triniti:ovp.medialive:command:start-channel');
  const canStopChannel = !isRefreshing && isRunning && policy.isGranted('triniti:ovp.medialive:command:stop-channel');

  const handleStartChannel = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, START!',
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    if (!result.value) {
      return;
    }

    try {
      await progressIndicator.show('Starting Channel...');
      await dispatch(startMediaLiveChannel(nodeRef));
      await delay(5000); // merely here to give AWS time to start the channel
      await progressIndicator.close();
      toast({ title: 'Channel started.' });
      refresh();
    } catch (e) {
      await progressIndicator.close();
      dispatch(sendAlert({ type: 'danger', message: getFriendlyErrorMessage(e) }));
    }
  };

  const handleStopChannel = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'To stream again, you will have to stop the encoders, restart the channel, and then restart the encoders.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, STOP!',
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    if (!result.value) {
      return;
    }

    try {
      await progressIndicator.show('Stopping Channel...');
      await dispatch(stopMediaLiveChannel(nodeRef));
      await delay(5000); // merely here to give AWS time to stop the channel
      await progressIndicator.close();
      toast({ title: 'Channel stopped.' });
      refresh();
    } catch (e) {
      await progressIndicator.close();
      dispatch(sendAlert({ type: 'danger', message: getFriendlyErrorMessage(e) }));
    }
  };

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
        <CardText className="pt-2 ms-4">
          <ActionButton
            text={isRunning ? 'Stop Channel' : 'Start Channel'}
            onClick={isRunning ? handleStopChannel : handleStartChannel}
            color={isRunning ? 'danger' : 'dark'}
            disabled={isRunning ? !canStopChannel : !canStartChannel}
          />
          <ActionButton text="Refresh State" onClick={refresh} color="light" outline disabled={isRefreshing} />
          <Label className="d-inline">State: {medialive.channelState}</Label>
          <Icon imgSrc="circle" color={isRunning ? 'danger' : 'dark'} />
        </CardText>

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
