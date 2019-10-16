/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  ListGroup,
  ListGroupItem,
  ListGroupItemText, StatusMessage,
} from '@triniti/admin-ui-plugin/components';
import startCase from 'lodash/startCase';
import moment from 'moment';
import Message from '@gdbots/pbj/Message';
import Exception from '@gdbots/common/Exception';
import { STATUS_FULFILLED, STATUS_NONE } from '@triniti/app/constants';
import UserLink from './UserLink';
import EventDetails from './EventDetails';
import RawViewButton from '../raw-view-button';

class EventStream extends React.Component {
  static propTypes = {
    events: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
    getUser: PropTypes.func.isRequired,
    response: PropTypes.instanceOf(Message),
    onLoadMore: PropTypes.func.isRequired,
    status: PropTypes.string,
    exception: PropTypes.instanceOf(Exception),
  };

  static defaultProps = {
    events: [],
    status: STATUS_NONE,
    exception: null,
    response: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      allEvents: [],
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { events } = this.props;
    const { allEvents } = this.state;

    if (prevProps.events.length === 0 && events.length === 0) {
      return;
    }
    if (prevProps.events.length === 0 && events.length > 0) {
      this.setState({ allEvents: [...allEvents, ...events] });
    }
    if (prevProps.events.length > 0 && events.length > 0) {
      // If new set of events are not passed in do not update state.
      if (prevProps.events[0].get('event_id') !== events[0].get('event_id')) {
        this.setState({ allEvents: [...allEvents, ...events] });
      }
    }
  }

  render() {
    const {
      getUser,
      response,
      onLoadMore: handleLoadMore,
      status,
      exception,
    } = this.props;

    const { allEvents } = this.state;

    return (
      <Card>
        <CardHeader>History</CardHeader>
        <CardBody indent>
          <ListGroup borderless>
            {
              (!response || status !== STATUS_FULFILLED)
              && <StatusMessage status={status} exception={exception} />
            }
            {allEvents.map((event) => {
              const eventAction = startCase(event.generateMessageRef().getCurie().getMessage());
              const occurredAt = moment(event.get('occurred_at').toDate()).format('MMM DD, YYYY hh:mm:ss A');
              const occurredAtAgo = moment(event.get('occurred_at').toDate()).fromNow();
              const user = event.get('ctx_user_ref') && getUser(event.get('ctx_user_ref'));
              return (
                <ListGroupItem key={event.get('occurred_at')} className="mb-0">
                  <ListGroupItemText>
                    <span className="mr-2">
                      <span className="mr-2"><strong>{eventAction}</strong></span>
                      <span className="mr-2">{user ? 'by' : 'from'}</span>
                      <strong><UserLink user={user} /></strong>
                      <br />
                      <span className="mr-2 text-danger">({occurredAtAgo})</span>
                      <i>{occurredAt}</i>
                    </span>
                    <span className="float-right"><RawViewButton event={event} /></span>
                  </ListGroupItemText>
                  <ListGroup borderless>
                    <EventDetails event={event} />
                  </ListGroup>
                </ListGroupItem>
              );
            })}
          </ListGroup>
          {
            response && response.get('has_more')
            && <Button key="a" style={{ margin: 0 }} onClick={handleLoadMore} color="secondary">Load More</Button>
          }
        </CardBody>
      </Card>
    );
  }
}

export default EventStream;
