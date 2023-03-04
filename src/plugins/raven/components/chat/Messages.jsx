import React from 'react';
import PropTypes from 'prop-types';
import {
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
} from 'reactstrap';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import moment from 'moment';

const Messages = ({ messages = [], getUser }) => {
  const items = messages.map((message) => {
    const user = !message.isMe && message.userRef && getUser(message.userRef);
    return (
      <ListGroupItem key={message.ts} className={message.isMe && 'list-group-chat-item-me'}>
        <ListGroupItemHeading>
          {!message.isMe && user && user.get('title')}
          {!message.isMe && !user && 'SYSTEM'}
          {message.isMe && 'You'}
          <small className="ml-2">{moment.unix(message.ts).fromNow()}</small>
        </ListGroupItemHeading>
        <ListGroupItemText>{message.text}</ListGroupItemText>
      </ListGroupItem>
    );
  });

  return (
    <ListGroup className="list-group-chat">
      {items}
    </ListGroup>
  );
};

Messages.propTypes = {
  getUser: PropTypes.func.isRequired,
  messages: PropTypes.arrayOf(PropTypes.shape({
    rt: PropTypes.string, // a raven type
    ts: PropTypes.number, // unix timestamp
    userRef: PropTypes.instanceOf(NodeRef),
    isMe: PropTypes.bool,
    // pbj: PropTypes.instanceOf(Message), // present if message was a pbjx event
  })),
};


export default Messages;