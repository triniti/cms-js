import { Button, Icon, Label } from '@triniti/admin-ui-plugin/components';
import { connect } from 'react-redux';
import ChannelState from '@triniti/schemas/triniti/ovp.medialive/enums/ChannelState';
import PropTypes from 'prop-types';
import React from 'react';
import delegate from './delegate';
import selector from './selector';

const MediaLiveChannelState = ({
  handleStartChannel,
  handleStopChannel,
  isPermissionGranted,
  size,
  state,
}) => {
  const isIdle = state === ChannelState.IDLE.getValue();
  const isRunning = state === ChannelState.RUNNING.getValue();
  return (
    <>
      {isPermissionGranted && (
      <Button
        className={`mr-3 ${size === 'md' ? 'mb-0' : 'mb-1'}`}
        disabled={!(isIdle || isRunning)}
        onClick={isIdle ? handleStartChannel : handleStopChannel}
        size={size}
      >
        {isRunning ? 'Stop Channel' : 'Start Channel'}
      </Button>
      )}
      <Label>{`State: ${state}`}</Label>
      {state && <Icon className="ml-2" imgSrc="circle" color={isRunning ? 'danger' : 'dark'} />}
    </>
  );
};

MediaLiveChannelState.propTypes = {
  handleStartChannel: PropTypes.func.isRequired,
  handleStopChannel: PropTypes.func.isRequired,
  isPermissionGranted: PropTypes.bool.isRequired,
  size: PropTypes.string,
  state: PropTypes.string,
};

MediaLiveChannelState.defaultProps = {
  size: 'md',
  state: null,
};

export default connect(selector, delegate)(MediaLiveChannelState);
