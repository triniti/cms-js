import { Card, CardBody, CardHeader, Col, Row } from '@triniti/admin-ui-plugin/components';
import artifactUrl from '@triniti/cms/plugins/ovp/utils/artifactUrl';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import ReactPlayer from 'react-player';

const VideoPreview = ({ node }) => {
  if (!node) {
    return null;
  }
  return (
    <Card>
      <CardHeader className="mb-4">Video Preview</CardHeader>
      <Card>
        <CardBody className="pt-0">
          <Row>
            <Col>
              <ReactPlayer url={artifactUrl(node, 'video')} width="100%" height="auto" controls />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Card>
  );
};

VideoPreview.propTypes = {
  node: PropTypes.instanceOf(Message),
};

VideoPreview.defaultProps = {
  node: null,
};

export default VideoPreview;
