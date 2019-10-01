import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Form,
  Icon,
  Input,
  InputGroup,
  InputGroupAddon,
} from '@triniti/admin-ui-plugin/components';
import selector from './selector';
import delegateFactory from './delegate';
import Messages from './Messages';
import './styles.scss';

class Chat extends React.Component {
  static propTypes = {
    delegate: PropTypes.shape({
      handleSendText: PropTypes.func.isRequired,
    }).isRequired,
    getUser: PropTypes.func.isRequired,
    isConnected: PropTypes.bool,
    isConnecting: PropTypes.bool,
    messages: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    isConnected: false,
    isConnecting: false,
    messages: [],
  };

  constructor(props) {
    super(props);
    this.state = { text: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ text: event.target.value });
  }

  handleSubmit(event) {
    const { delegate } = this.props;
    const { text } = this.state;
    event.preventDefault();
    if (text.length === 0) {
      return;
    }

    delegate.handleSendText(text);
    this.setState({ text: '' });
  }

  render() {
    const { text } = this.state;
    const { isConnected, isConnecting, getUser, messages } = this.props;

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
          <Form onSubmit={this.handleSubmit} className="chat-form">
            <InputGroup>
              <Input
                type="text"
                name="text"
                value={text}
                onChange={this.handleChange}
                onBlur={this.handleChange}
                placeholder="Type your message"
                autoComplete="off"
              />
              <InputGroupAddon addonType="append">
                <Button disabled={!isConnected}>{isConnecting ? 'Connecting...' : 'Send'}</Button>
              </InputGroupAddon>
            </InputGroup>
          </Form>
        </CardBody>
      </Card>
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(Chat);
