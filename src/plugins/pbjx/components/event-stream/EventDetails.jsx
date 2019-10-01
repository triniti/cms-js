import React from 'react';
import PropTypes from 'prop-types';
import { Button, CardTitle, Collapse, ListGroupItem } from '@triniti/admin-ui-plugin/components';
import Message from '@gdbots/pbj/Message';
import findDiff from './findDiff';

class EventDetails extends React.Component {
  constructor(props) {
    super(props);

    const { event } = props;
    const visualDiff = findDiff(event);

    this.state = {
      collapse: false,
      collapseContent: visualDiff,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(({ collapse }) => ({ collapse: !collapse }));
  }

  render() {
    const { collapse, collapseContent } = this.state;
    const detailAction = collapse ? 'Hide' : 'See';

    return (
      <ListGroupItem className="mb-0">
        {collapseContent && (
          <CardTitle tag="h5">
            <Button outline={!collapse} size="sm" color="secondary" onClick={this.toggle}>
              {detailAction} Event Details
            </Button>
          </CardTitle>
        )}
        <Collapse isOpen={collapse}>
          {collapseContent}
        </Collapse>
      </ListGroupItem>
    );
  }
}

EventDetails.propTypes = {
  event: PropTypes.instanceOf(Message).isRequired,
};

export default EventDetails;
