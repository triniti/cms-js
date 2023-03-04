import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Form,
  Input,
  InputGroup,
} from 'reactstrap';
import { Icon } from 'components';
import selector from 'plugins/raven/components/chat/selector';
import Messages from 'plugins/raven/components/chat/Messages';
import sendText from 'plugins/raven/actions/sendText';
import 'plugins/raven/components/chat/styles.scss';

const Chat = ({
  getUser,
  isConnected = false,
  isConnecting = false,
  messages = [],
}) => {
  const [ text, setText ] = useState('');
  const dispatch = useDispatch();

  const handleChange = (event) => {
    setText(event.target.value);
  }

  const handleSendText = (text) => {
    dispatch(sendText(text, `${ownProps.nodeRef}`));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (text.length === 0) {
      return;
    }

    handleSendText(text);
    setText('');
  }

  return (
    <Card className="chat-container">
      <CardHeader>Updates {isConnected ? '(online)' : '(offline)'}</CardHeader>
      <CardBody className="chat-body">
        {!messages.length
        && (
        <p className="align-middle text-muted text-center">
          <Icon imgSrc="comment-oval" className="mr-1" /> No messages
        </p>
        )}
        <Messages getUser={getUser} messages={messages} />
        <Form onSubmit={handleSubmit} className="chat-form">
          <InputGroup>
            <Input
              type="text"
              name="text"
              value={text}
              onChange={handleChange}
              onBlur={handleChange}
              placeholder="Type your message"
              autoComplete="off"
            />
            <Button disabled={!isConnected}>{isConnecting ? 'Connecting...' : 'Send'}</Button>
          </InputGroup>
        </Form>
      </CardBody>
    </Card>
  );
}

export default connect(selector)(Chat);