import React from 'react';
import { Label } from 'reactstrap';
import { Icon } from '@triniti/cms/components/index.js';
import { ActionButton } from '@triniti/cms/components/index.js';
import ChannelState from '@triniti/schemas/triniti/ovp.medialive/enums/ChannelState.js';

function MedialiveChannelStateButton(props) {
  {
    const {channelState, handleStartChannels, handleStopChannels} = props;
    const isIdle = channelState === ChannelState.IDLE.getValue();
    const isRunning = channelState === ChannelState.RUNNING.getValue();

    return (
      <>
        <ActionButton
          text={isRunning ? 'Stop Channel' : 'Start Channel'}
          onClick={isIdle ? handleStartChannels : handleStopChannels}
          color="light"
          disabled={channelState === ChannelState.STARTING.getValue() || channelState === ChannelState.STOPPING.getValue()}
        />
        <Label style={{'display':'inline'}} >{`State: ${channelState}`}</Label>
        {channelState &&
          <Icon imgSrc="circle" color={isRunning ? 'danger' : 'dark'}/>}
      </>
    );
  }
}

export default MedialiveChannelStateButton;
