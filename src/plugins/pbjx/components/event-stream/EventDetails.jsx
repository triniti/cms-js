import React from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';
import { ListGroupItem } from '@triniti/admin-ui-plugin/components';
import eventRenderer from './eventRenderer';

class EventDetails extends React.Component {
  constructor(props) {
    super(props);

    const { event } = props;
    const eventContent = eventRenderer(event);

    this.state = {
      eventContent,
    };
  }

  render() {
    const { eventContent } = this.state;

    return (
      <ListGroupItem className="mb-0">
        {eventContent}
      </ListGroupItem>
    );
  }
}

EventDetails.propTypes = {
  event: PropTypes.instanceOf(Message).isRequired,
};

export default EventDetails;
