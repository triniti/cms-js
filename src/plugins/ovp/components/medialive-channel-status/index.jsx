import { connect } from 'react-redux';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import toast from '@triniti/admin-ui-plugin/utils/toast';
import {
  Button,
  Card,
  CardBody,
  Col,
  Icon,
  Label,
  Row,
  Spinner,
} from '@triniti/admin-ui-plugin/components';
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
    const { node, status } = this.props;
    const { isPending } = this.state;
    if (!node) {
      return null;
    }
    const statusLabel = !status ? 'No Channel' : `Status: ${status}`;
    return (
      <Card>
        <CardBody className="pt-0">
          <Row>
            <Col>
              <Button onClick={this.handleUpdateStatus} disabled={!status}>
                {status === 'RUNNING' ? 'Stop Channel' : 'Start Channel'}
              </Button>
              <Label className="ml-1">{isPending ? 'Pending' : statusLabel}</Label>
              {(status || isPending) && (isPending
                ? <Spinner className="ml-2 mb-2" width="12" strokeWidth="10" />
                : <Icon className="ml-2" imgSrc="circle" color={status === 'RUNNING' ? 'danger' : 'dark'} />
              )}
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  }
}

MediaLiveChannelStatus.propTypes = {
  handleStartChannel: PropTypes.func.isRequired,
  handleStopChannel: PropTypes.func.isRequired,
  node: PropTypes.instanceOf(Message),
  status: PropTypes.string,
};

MediaLiveChannelStatus.defaultProps = {
  node: null,
  status: null,
};

export default connect(selector, delegate)(MediaLiveChannelStatus);
