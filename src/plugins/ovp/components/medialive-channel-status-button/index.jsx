import { Button, Icon, Label, Spinner } from '@triniti/admin-ui-plugin/components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import toast from '@triniti/admin-ui-plugin/utils/toast';
import delegate from './delegate';
import selector from './selector';

class MediaLiveChannelStatus extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isPending: false,
    };

    this.handleUpdateStatus = this.handleUpdateStatus.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { status } = this.props;
    const { isPending } = this.state;
    if (isPending && status !== prevProps.status) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(() => ({ isPending: false }), toast.hide);
    }
  }

  handleUpdateStatus() {
    const { handleStartChannel, handleStopChannel, status } = this.props;
    this.setState(() => ({ isPending: true }), () => {
      toast.show();
      if (status === 'IDLE') {
        handleStartChannel();
      } else {
        handleStopChannel();
      }
    });
  }

  render() {
    const { isPermissionGranted, size, status } = this.props;
    const { isPending } = this.state;
    const statusLabel = !status ? 'No Channel' : `Status: ${status}`;
    return (
      <>
        {isPermissionGranted && (
        <Button
          className={`mr-3 ${size === 'md' ? 'mb-0' : 'mb-1'}`}
          disabled={!status}
          onClick={this.handleUpdateStatus}
          size={size}
        >
          {status === 'RUNNING' ? 'Stop Channel' : 'Start Channel'}
        </Button>
        )}
        <Label>{isPending ? 'Pending' : statusLabel}</Label>
        {(status || isPending) && (isPending
          ? <Spinner className="ml-2 mb-2" width="12" strokeWidth="10" />
          : <Icon className="ml-2" imgSrc="circle" color={status === 'RUNNING' ? 'danger' : 'dark'} />
        )}
      </>
    );
  }
}

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
