import MediaLiveChannelStateButton from '@triniti/cms/plugins/ovp/components/medialive-channel-state-button';
import Message from '@gdbots/pbj/Message';
import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardHeader, Col, Row } from '@triniti/admin-ui-plugin/components';

const MediaLiveChannelState = ({ node }) => {
  if (!node) {
    return null;
  }
  return (
    <Card>
      <CardHeader className="mb-4">Livestream</CardHeader>
      <Card>
        <CardBody className="pt-0">
          <Row>
            <Col>
              <MediaLiveChannelStateButton node={node} />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Card>
  );
};

MediaLiveChannelState.propTypes = {
  node: PropTypes.instanceOf(Message),
};

MediaLiveChannelState.defaultProps = {
  node: null,
};

export default MediaLiveChannelState;
