import { connect } from 'react-redux';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
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

const MediaLiveChannelStatus = ({ handleStartChannel, node, status }) => {
  if (!node) {
    return null;
  }
  let statusIndicator;
  if (status === 'IDLE' || status === 'RUNNING') {
    statusIndicator = <Icon className="ml-2" imgSrc="circle" color={status === 'RUNNING' ? 'danger' : 'dark'} />;
  } else {
    statusIndicator = <Spinner className="ml-2 mb-2" width="12" strokeWidth="10" />;
  }
  return (
    <Card>
      <CardBody className="pt-0">
        <Row>
          <Col>
            <Button onClick={handleStartChannel} disabled={status !== 'IDLE' && status !== 'RUNNING'}>
              {status === 'IDLE' ? 'Start Channel' : 'Stop Channel'}
            </Button>
            <Label className="ml-1">{`Status: ${status}`}</Label>
            {statusIndicator}
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

MediaLiveChannelStatus.propTypes = {
  handleStartChannel: PropTypes.func.isRequired,
  node: PropTypes.instanceOf(Message),
  status: PropTypes.string,
};

MediaLiveChannelStatus.defaultProps = {
  node: null,
  status: 'IDLE',
};

export default connect(selector, delegate)(MediaLiveChannelStatus);
