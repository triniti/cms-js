import PropTypes from 'prop-types';
import React from 'react';
import Message from '@gdbots/pbj/Message';
import convertReadableTime from '@triniti/cms/utils/convertReadableTime';
import SendStatus from '@triniti/schemas/triniti/notify/enums/NotificationSendStatus';
import {
  Card,
  CardBody,
  ListGroup,
  ListGroupItem,
  Spinner,
} from '@triniti/admin-ui-plugin/components';

const NotificationSendStatus = ({ node }) => (
  <Card className="mb-0">
    <CardBody className="pb-0">
      <ListGroup>
        {node.has('send_status')
          ? (
            <ListGroupItem>
              <strong>Send Status: </strong>
              <span
                className={`status-copy status-${node.get('send_status').toString().toLowerCase()}`}
              >
                {node.get('send_status').toString().toUpperCase()}
              </span>
            </ListGroupItem>
          )
          : <Spinner />}
        {node.get('send_on_publish') && (
          <ListGroupItem>
            <strong>Send On Publish: True</strong>
          </ListGroupItem>
        )}
        {node.get('send_status') === SendStatus.SCHEDULED && (
          <ListGroupItem>
            <strong>Scheduled at: </strong>
            {convertReadableTime(node.get('send_at'))}
          </ListGroupItem>
        )}
        {node && node.has('sent_at') && (
        <ListGroupItem>
          <strong>Sent At: </strong>
          {convertReadableTime(node.get('sent_at'))}
        </ListGroupItem>
        )}
      </ListGroup>
    </CardBody>
  </Card>
);

NotificationSendStatus.propTypes = {
  node: PropTypes.instanceOf(Message).isRequired,
};

export default NotificationSendStatus;
