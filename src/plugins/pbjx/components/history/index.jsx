/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { STATUS_FULFILLED } from '@triniti/app/constants';
import {Button, Card, CardBody, CardHeader, ListGroup, StatusMessage} from '@triniti/admin-ui-plugin/components';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import Message from '@gdbots/pbj/Message';
import Schema from '@gdbots/pbj/Schema';
import StreamId from '@gdbots/schemas/gdbots/pbjx/StreamId';
import EventStream from '../event-stream';
import selector from './selector';
import delegateFactory from './delegate';
import startCase from "lodash/startCase";
import UserLink from "../event-stream/UserLink";
import RawViewButton from "../raw-view-button";
import EventDetails from "../event-stream/EventDetails";
import moment from 'moment';


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

  constructor(props) {
    super(props);
    this.state = {
      allEvents: [],
    };
  }

  componentDidMount() {
    const { delegate, streamId, schema } = this.props;
    delegate.handleInitialize(streamId, schema);
  }

  componentDidUpdate(prevProps, prevState) {
    const { events } = this.props;
    const { allEvents } = this.state;

    if (prevProps.events.length === 0 && events.length === 0) {
      console.log('BOTH EMPTY');
      return;
    }
    if (prevProps.events.length === 0 && events.length > 0) {
      console.log('push new state');
      this.setState({ allEvents: [...allEvents, ...events] });
    }
    if (prevProps.events.length > 0 && events.length > 0) {
      // Check to see if first event prop and prev event prop are the same.
      // If same do not append to local event state
      if (prevProps.events[0].get('event_id') !== events[0].get('event_id')) {
        this.setState({ allEvents: [...allEvents, ...events] });
      }
    }
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

    const { allEvents } = this.state;

    if (!response || status !== STATUS_FULFILLED) {
      return <StatusMessage status={status} exception={exception} />;
    }
    return (
    <div>
      {events.map((event) => (<p>{event.get('event_id')}</p>))}
    </div>
    );
     // return <EventStream events={allEvents} getUser={getUser} response={response} onLoadMore={() => delegate.handleLoadMore(streamId, schema, response.get('last_occurred_at'))} />;
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(History);
