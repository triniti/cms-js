/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Icon,
  ListGroup,
  ListGroupItem,
  StatusMessage,
} from '@triniti/admin-ui-plugin/components';
import startCase from 'lodash/startCase';
import moment from 'moment';
import Message from '@gdbots/pbj/Message';
import Exception from '@gdbots/common/Exception';
import { STATUS_FULFILLED, STATUS_NONE, STATUS_PENDING } from '@triniti/app/constants';
import UserLink from './UserLink';
import EventDetails from './EventDetails';
import RawViewButton from '../raw-view-button';
import RevertButton from '../revert-button';

class EventStream extends React.Component {
  static propTypes = {
    events: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
    getUser: PropTypes.func.isRequired,
    response: PropTypes.instanceOf(Message),
    onLoadMore: PropTypes.func.isRequired,
    onRefresh: PropTypes.func.isRequired,
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
      loadMore: false,
    };

    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { events } = this.props;
    const { allEvents } = this.state;

    if (!prevProps.events.length && !events.length) {
      return;
    }
    // Add events to local state if new events are added to store from load more.
    if (events.length) {
      if (!prevProps.events.length || (prevProps.events[0].get('event_id') !== events[0].get('event_id'))) {
        this.setState({ allEvents: [...allEvents, ...events], loadMore: false });
      }
    }
  }

  handleLoadMore() {
    const { onLoadMore: handleLoadMore } = this.props;

    handleLoadMore();
    this.setState({ loadMore: true });
  }

  handleRefresh() {
    const { onRefresh: handleRefresh } = this.props;

    handleRefresh();
    this.setState({ allEvents: [] });
  }

  render() {
    const {
      getUser,
      response,
      status,
      exception,
    } = this.props;

    const { allEvents, loadMore } = this.state;

    return (
      <Card>
        <CardHeader>
          History
          <Button onClick={this.handleRefresh} size="sm">
            <Icon imgSrc="refresh" noborder />
          </Button>
        </CardHeader>
        <CardBody className="pl-0 pr-0">
          {
            (!response || status !== STATUS_FULFILLED)
            && <div className="ml-4"><StatusMessage status={status} exception={exception} /></div>
          }
          <ListGroup borderless>
            {allEvents.map((event) => {
              const eventAction = startCase(event.generateMessageRef().getCurie().getMessage());
              const occurredAt = moment(event.get('occurred_at').toDate()).format('MMM DD, YYYY hh:mm:ss A');
              const occurredAtAgo = moment(event.get('occurred_at').toDate()).fromNow();
              const user = event.get('ctx_user_ref') && getUser(event.get('ctx_user_ref'));
              const schema = event.schema();
              return (
                <ListGroupItem key={event.get('occurred_at')} className="mb-0">
                  <div className="d-flex justify-content-between">
                    <div className="d-flex flex-column mr-2">
                      <h5 className="mb-2">
                        <span className="mr-1"><strong>{eventAction}</strong></span>
                        <span className="mr-1">{user ? 'by' : 'from'}</span>
                        <strong><UserLink user={user} /></strong>
                      </h5>
                      <div className="d-flex align-items-center mb-2" style={{ fontSize: '11px' }}>
                        <Badge color="light" className="mr-1" pill>{occurredAtAgo}</Badge>
                        <span>{occurredAt}</span>
                      </div>
                    </div>
                    <span>
                      { schema.hasMixin('gdbots:ncr:mixin:node-updated') && <RevertButton event={event} /> }
                      <RawViewButton event={event} />
                    </span>
                  </div>
                  <span>
                    <EventDetails event={event} />
                  </span>
                </ListGroupItem>
              );
            })}
          </ListGroup>
          {
            response && response.get('has_more') && !loadMore
            && <Button className="ml-4" key="a" style={{ margin: 0 }} onClick={this.handleLoadMore} color="secondary">Load More</Button>
          }
        </CardBody>
        {
          loadMore && <div className="ml-4"><StatusMessage className="ml-4" status={STATUS_PENDING} /></div>
        }
      </Card>
    );
  }
}

export default EventStream;
