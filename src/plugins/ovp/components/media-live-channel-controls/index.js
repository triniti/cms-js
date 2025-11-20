import React from 'react';
import Swal from 'sweetalert2';
import { CardText, Label, Spinner } from 'reactstrap';
import ChannelState from '@triniti/schemas/triniti/ovp.medialive/enums/ChannelState.js';
import { useDispatch } from 'react-redux';
import { ActionButton, Icon } from '@triniti/cms/components/index.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import progressIndicator from '@triniti/cms/utils/progressIndicator.js';
import delay from '@triniti/cms/utils/delay.js';
import toast from '@triniti/cms/utils/toast.js';
import sendAlert from '@triniti/cms/actions/sendAlert.js';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';
import startMediaLiveChannel from '@triniti/cms/plugins/ovp/actions/startMediaLiveChannel.js';
import stopMediaLiveChannel from '@triniti/cms/plugins/ovp/actions/stopMediaLiveChannel.js';

export default function MediaLiveChannelControls(props) {
  const { nodeRef, medialive, refresh, isRefreshing = false, statusOnNewLine = false } = props;
  const dispatch = useDispatch();
  const policy = usePolicy();

  const isIdle = medialive.channelState === ChannelState.IDLE.getValue();
  const isRunning = medialive.channelState === ChannelState.RUNNING.getValue();
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
      await delay(5000);
      await progressIndicator.close();
      toast({title: 'Channel started.'});
      refresh();
    } catch (e) {
      await progressIndicator.close();
      dispatch(sendAlert({type: 'danger', message: getFriendlyErrorMessage(e)}));
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
      await delay(5000);
      await progressIndicator.close();
      toast({title: 'Channel stopped.'});
      refresh();
    } catch (e) {
      await progressIndicator.close();
      dispatch(sendAlert({type: 'danger', message: getFriendlyErrorMessage(e)}));
    }
  };

  return (
    <CardText className="pt-2 ms-4">
      <ActionButton
        text={isRunning ? 'Stop Channel' : 'Start Channel'}
        onClick={isRunning ? handleStopChannel : handleStartChannel}
        color={isRunning ? 'danger' : 'dark'}
        disabled={isRunning ? !canStopChannel : !canStartChannel}
      />
      <ActionButton text="Refresh State" onClick={refresh} color="light" outline disabled={isRefreshing}/>
      {isRefreshing && <Spinner className="ms-2" size="sm"/>}
      <span className={statusOnNewLine ? 'd-block w-100 mt-2' : ''}>
        <Label className="d-inline">State: {medialive.channelState}</Label>
        <Icon imgSrc="circle" color={isRunning ? 'danger' : 'dark'}/>
      </span>
    </CardText>
  );
}
