import React from 'react';
import { Label } from 'reactstrap';
import { ActionButton, Icon } from 'components';
import ChannelState from '@triniti/schemas/triniti/ovp.medialive/enums/ChannelState';
import classNames from 'classnames';

function MedialiveChannelStateButton(props) {
  {
    const { channelState, className, handleStartChannels, handleStopChannels } = props;
    const isIdle = channelState === ChannelState.IDLE.getValue();
    const isRunning = channelState === ChannelState.RUNNING.getValue();

    return (
      <div className={className}>
        <ActionButton
          text={isRunning ? 'Stop Channel' : 'Start Channel'}
          onClick={isIdle ? handleStartChannels : handleStopChannels}
          color="light"
          disabled={channelState === ChannelState.STARTING.getValue() || channelState === ChannelState.STOPPING.getValue()}
        />
        <Label style={{'display':'inline'}} >{`State: ${channelState}`}</Label>
        {channelState &&
          <Icon imgSrc="circle" style={{'marginLeft':'5px'}} color={isRunning ? 'danger' : 'dark'}/>
        }
      </div>
    );
  }
}

export default MedialiveChannelStateButton;