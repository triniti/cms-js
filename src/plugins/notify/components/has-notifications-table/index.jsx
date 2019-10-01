import decorateComponentWithProps from 'decorate-component-with-props';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import createDelegateFactory from '@triniti/app/createDelegateFactory';
import CreateNotificationModal
  from '@triniti/cms/plugins/notify/components/create-notification-modal';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { STATUS_FULFILLED } from '@triniti/app/constants';
import {
  Card,
  CardBody,
  CardHeader,
  CreateModalButton,
  StatusMessage,
  Table,
} from '@triniti/admin-ui-plugin/components';

import delegateFactory from './delegate';
import selector from './selector';
import TableRow from './TableRow';

class HasNotificationsTable extends React.Component {
  static propTypes = {
    delegate: PropTypes.shape({
      handleSearchNotification: PropTypes.func,
    }).isRequired,
    // contentRef is required by delegate!
    contentRef: PropTypes.instanceOf(NodeRef).isRequired, // eslint-disable-line
    searchNodesRequestState: PropTypes.shape({
      exception: PropTypes.object,
      request: PropTypes.object,
      response: PropTypes.object,
      status: PropTypes.string,
    }).isRequired,
  };

  componentDidMount() {
    const { delegate } = this.props;
    delegate.handleSearchNotification();
  }

  render() {
    const { delegate, searchNodesRequestState } = this.props;
    const { response, status, exception } = searchNodesRequestState;

    if (!response || status !== STATUS_FULFILLED) {
      return <StatusMessage status={status} exception={exception} />;
    }

    const nodes = response.get('nodes', []);
    return (
      <Card>
        <CardHeader>
          <CreateModalButton
            className="ml-auto mt-2 mb-2"
            modal={
              decorateComponentWithProps(CreateNotificationModal, { contentChangeable: false })
            }
            onClick={delegate.handleInitCreateNotificationForm}
            text="Create Notification"
          />
        </CardHeader>
        <CardBody>
          {nodes.length ? (
            <Table className="table-borderless table-stretch" hover responsive>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Creation Date</th>
                  <th>Send At</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {nodes.map((node) => (
                  <TableRow key={node.get('_id')} node={node} />
                ))}
              </tbody>
            </Table>
          ) : <div className="not-found-message"><p>No notifications found.</p></div>}
        </CardBody>
      </Card>
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(HasNotificationsTable);
