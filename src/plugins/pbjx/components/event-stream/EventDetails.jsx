import React from 'react';
import PropTypes from 'prop-types';
import { ListGroupItem } from '@triniti/admin-ui-plugin/components';
import Message from '@gdbots/pbj/Message';
import findDiff from './findDiff';

class EventDetails extends React.Component {
  constructor(props) {
    super(props);

    const { event } = props;
    const visualDiff = findDiff(event);

    this.state = {
      collapseContent: visualDiff,
    };
  }

  render() {
    const { collapseContent } = this.state;

    return (
      <div className="mb-0">
        {collapseContent}
      </div>
    );
  }
}

EventDetails.propTypes = {
  event: PropTypes.instanceOf(Message).isRequired,
};

export default EventDetails;
