import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { STATUS_FULFILLED } from '@triniti/app/constants';
import { StatusMessage } from '@triniti/admin-ui-plugin/components';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import Message from '@gdbots/pbj/Message';
import Schema from '@gdbots/pbj/Schema';
import StreamId from '@gdbots/schemas/gdbots/pbjx/StreamId';
import EventStream from '../event-stream';
import selector from './selector';
import delegateFactory from './delegate';

class History extends React.Component {
  static propTypes = {
    delegate: PropTypes.shape({
      handleInitialize: PropTypes.func,
    }).isRequired,
    events: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
    getHistoryRequestState: PropTypes.shape({
      exception: PropTypes.object,
      request: PropTypes.object,
      response: PropTypes.object,
      status: PropTypes.string,
    }).isRequired,
    getUser: PropTypes.func.isRequired,
    schema: PropTypes.instanceOf(Schema).isRequired,
    streamId: PropTypes.instanceOf(StreamId).isRequired,
  };

  static defaultProps = {
    events: [],
  };

  componentDidMount() {
    const { delegate, streamId, schema } = this.props;
    delegate.handleInitialize(streamId, schema);
  }

  componentWillUnmount() {
    // fixme: this component is using a mutant delegate that's half one strategy
    // and half another clean this up and make it consistent.
    const { delegate, schema } = this.props;
    delegate.componentWillUnmount(schema);
  }

  render() {
    const { events, getUser, getHistoryRequestState: { response, status, exception } } = this.props;
    if (!response || status !== STATUS_FULFILLED) {
      return <StatusMessage status={status} exception={exception} />;
    }

    return <EventStream events={events} getUser={getUser} />;
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(History);
