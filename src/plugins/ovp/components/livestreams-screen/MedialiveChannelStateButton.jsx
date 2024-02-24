import React from 'react';
import { Button, Card, CardBody, CardHeader, Label } from 'reactstrap';
import { Icon } from 'components';
import ChannelState from '@triniti/schemas/triniti/ovp.medialive/enums/ChannelState';

function MedialiveChannelStateButton(props) {
  {
    const {channelState, handleStartChannels, handleStopChannels} = props;
    console.log('propsss =' , props);

    const isIdle = channelState === ChannelState.IDLE.getValue();
    const isRunning = channelState === ChannelState.RUNNING.getValue();

    return (
      <>
        <Button
          onClick={isIdle ? handleStartChannels : handleStopChannels}
        >
          {isRunning ? 'Stop Channel' : 'Start Channel'}
        </Button>
        <Label style={{'display':'inline'}} >{`State: ${channelState}`}</Label>
        {channelState &&
          <Icon imgSrc="circle" color={isRunning ? 'danger' : 'dark'}/>}
      </>
    );
  }
}

export default MedialiveChannelStateButton;
