import MediaLiveChannelStatusButton from '@triniti/cms/plugins/ovp/components/medialive-channel-status-button';
import React from 'react';
import { Card, CardBody, CardHeader, Col, Row } from '@triniti/admin-ui-plugin/components';

export default ({ node }) => {
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
              <MediaLiveChannelStatusButton node={node} />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Card>
  );
};
