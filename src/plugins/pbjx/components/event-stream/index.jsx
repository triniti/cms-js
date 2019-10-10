import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardBody,
  CardHeader,
  ListGroup,
  ListGroupItem,
  ListGroupItemText,
} from '@triniti/admin-ui-plugin/components';
import startCase from 'lodash/startCase';
import moment from 'moment';
import Message from '@gdbots/pbj/Message';
import UserLink from './UserLink';
import EventDetails from './EventDetails';
import RawViewButton from '../raw-view-button';

const EventStream = ({ events, getUser }) => (
  <Card>
    <CardHeader>History</CardHeader>
    <CardBody indent>
      <ListGroup borderless>
        {events.map((event) => {
          const eventAction = startCase(event.generateMessageRef().getCurie().getMessage());
          const occurredAt = moment(event.get('occurred_at').toDate()).format('MMM DD, YYYY hh:mm:ss A');
          const occurredAtAgo = moment(event.get('occurred_at').toDate()).fromNow();
          const user = event.get('ctx_user_ref') && getUser(event.get('ctx_user_ref'));

          return (
            <ListGroupItem key={event.get('occurred_at')} className="mb-0">
              <ListGroupItemText>
                <span className="mr-2"><strong>{eventAction}</strong></span>
                at
                <span className="ml-2"><i>{occurredAt}</i></span>
                <span className="ml-2 text-danger">({occurredAtAgo})</span>
                <span className="ml-2">{user ? 'by' : 'from'}</span>
                <span className="ml-2"><strong><UserLink user={user} /></strong></span>
                <span className="float-right"><RawViewButton event={event} /></span>
              </ListGroupItemText>
              <ListGroup borderless>
                <EventDetails event={event} />
              </ListGroup>
            </ListGroupItem>
          );
        })}
      </ListGroup>
    </CardBody>
  </Card>
);

EventStream.propTypes = {
  events: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
  getUser: PropTypes.func.isRequired,
};

EventStream.defaultProps = {
  events: [],
};

export default EventStream;
