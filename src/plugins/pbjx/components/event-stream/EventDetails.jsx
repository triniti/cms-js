import React from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';
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
      <div className="mb-0">
        {eventContent}
      </div>
    );
  }
}

EventDetails.propTypes = {
  event: PropTypes.instanceOf(Message).isRequired,
};

export default EventDetails;
