import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
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


class EventStream extends React.Component {
  static propTypes = {
    events: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
    getUser: PropTypes.func.isRequired,
    response: PropTypes.instanceOf(Message).isRequired,
    onLoadMore: PropTypes.func.isRequired,
  };

  static defaultProps = {
    events: [],
  };

  constructor(props) {
    super(props);
    console.log('construct');
  }

  render() {
    const {
      events,
      getUser,
      response,
      onLoadMore: handleLoadMore,
    } = this.props;

    return (
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
            response.get('has_more')
            && <Button key="a" style={{ margin: 0 }} onClick={handleLoadMore} color="secondary">Load More</Button>
          }
        </CardBody>
      </Card>
    );
  }
}

export default EventStream;
