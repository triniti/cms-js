import { Button, Icon, Label } from '@triniti/admin-ui-plugin/components';
import { connect } from 'react-redux';
import ChannelState from '@triniti/schemas/triniti/ovp.medialive/enums/ChannelState';
import PropTypes from 'prop-types';
import React from 'react';
import delegate from './delegate';
import selector from './selector';

const MediaLiveChannelState = ({
  channelState,
  handleStartChannel,
  handleStopChannel,
  canStartChannel,
  canStopChannel,
  size,
}) => {
  const isIdle = channelState === ChannelState.IDLE.getValue();
  const isRunning = channelState === ChannelState.RUNNING.getValue();
  return (
    <>
      {(canStartChannel || canStopChannel) && (
      <Button
        className={`mr-3 ${size === 'md' ? 'mb-0' : 'mb-1'}`}
        disabled={!(isIdle || isRunning) || (isIdle && !canStartChannel) || (isRunning && !canStopChannel)}
        onClick={isIdle ? handleStartChannel : handleStopChannel}
        size={size}
      >
        {isRunning ? 'Stop Channel' : 'Start Channel'}
      </Button>
      )}
      <Label>{`State: ${channelState}`}</Label>
      {channelState && <Icon className="ml-2" imgSrc="circle" color={isRunning ? 'danger' : 'dark'} />}
    </>
  );
};

MediaLiveChannelState.propTypes = {
  canStartChannel: PropTypes.bool.isRequired,
  canStopChannel: PropTypes.bool.isRequired,
  channelState: PropTypes.string.isRequired,
  handleStartChannel: PropTypes.func.isRequired,
  handleStopChannel: PropTypes.func.isRequired,
  size: PropTypes.string,
};

MediaLiveChannelState.defaultProps = {
  size: 'md',
};

export default connect(selector, delegate)(MediaLiveChannelState);
