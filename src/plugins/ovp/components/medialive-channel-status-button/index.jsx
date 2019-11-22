import { Button, Icon, Label } from '@triniti/admin-ui-plugin/components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import delegate from './delegate';
import selector from './selector';

const MediaLiveChannelStatus = ({
  handleStartChannel,
  handleStopChannel,
  isPermissionGranted,
  size,
  status,
}) => (
  <>
    {isPermissionGranted && (
    <Button
      className={`mr-3 ${size === 'md' ? 'mb-0' : 'mb-1'}`}
      disabled={!status}
      onClick={status === 'IDLE' ? handleStartChannel : handleStopChannel}
      size={size}
    >
      {status === 'RUNNING' ? 'Stop Channel' : 'Start Channel'}
    </Button>
    )}
    <Label>{!status ? 'No Channel' : `Status: ${status}`}</Label>
    {status && <Icon className="ml-2" imgSrc="circle" color={status === 'RUNNING' ? 'danger' : 'dark'} />}
  </>
);

MediaLiveChannelStatus.propTypes = {
  handleStartChannel: PropTypes.func.isRequired,
  handleStopChannel: PropTypes.func.isRequired,
  isPermissionGranted: PropTypes.bool.isRequired,
  size: PropTypes.string,
  status: PropTypes.string,
};

MediaLiveChannelStatus.defaultProps = {
  size: 'md',
  status: null,
};

export default connect(selector, delegate)(MediaLiveChannelStatus);
