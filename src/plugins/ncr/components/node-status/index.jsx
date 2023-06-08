import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import convertReadableTime from '@triniti/cms/utils/convertReadableTime';
import Message from '@gdbots/pbj/Message';
import { Card, CardBody, ListGroup, ListGroupItem } from '@triniti/admin-ui-plugin/components';
import selector from './selector';

const NodeStatus = ({ node, updatedAgo, user }) => (
  <Card className="mb-0">
    <CardBody className="pb-0">
      <ListGroup>
        <ListGroupItem>
          <strong>Status: </strong>
          <span className={`status-copy status-${node.get('status').getValue()}`}>
            {node.get('status').getName()}
          </span>
        </ListGroupItem>
        {node.has('published_at') && (
          <ListGroupItem>
            <strong>{node.get('status').getValue() === 'published' ? 'Published At: ' : 'Publish At: '}</strong>
            {convertReadableTime(node.get('published_at'))}
          </ListGroupItem>
        )}
        <ListGroupItem>
          <strong>Updated At: </strong>
          {convertReadableTime(node.get('updated_at', node.get('created_at')))}
          <br />
          <>
            <span className="text-danger">{`(${updatedAgo})`}</span>
            <em>{` by ${user ? user.get('title') : 'SYSTEM'}`}</em>
          </>
        </ListGroupItem>
      </ListGroup>
    </CardBody>
  </Card>
);

NodeStatus.propTypes = {
  node: PropTypes.instanceOf(Message).isRequired,
  updatedAgo: PropTypes.string.isRequired,
  user: PropTypes.instanceOf(Message),
};

NodeStatus.defaultProps = {
  user: null,
};

export default connect(selector)(NodeStatus);
