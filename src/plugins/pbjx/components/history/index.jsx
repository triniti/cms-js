import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
      handleLoadMore: PropTypes.func,
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
    const {
      delegate,
      events,
      getUser,
      getHistoryRequestState: { response, status, exception },
      streamId,
      schema,
    } = this.props;

    return (
      <EventStream
        events={events}
        getUser={getUser}
        status={status}
        exception={exception}
        response={response}
        onRefresh={() => delegate.handleInitialize(streamId, schema)}
        onLoadMore={() => delegate.handleLoadMore(streamId, schema, response.get('last_occurred_at'))}
      />
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(History);
