import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import Message from '@gdbots/pbj/Message';
import { STATUS_FULFILLED } from '@triniti/app/constants';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Icon,
  StatusMessage,
  Table,
} from '@triniti/admin-ui-plugin/components';
import delegateFactory from './delegate';
import selector from './selector';
import TableRow from './TableRow';

class TopArticles extends Component {
  static propTypes = {
    delegate: PropTypes.object.isRequired,
    exception: PropTypes.object,
    location: PropTypes.object.isRequired,
    response: PropTypes.instanceOf(Message),
    status: PropTypes.string,
    title: PropTypes.string.isRequired,
  };

  static defaultProps = {
    exception: null,
    response: null,
    status: '',
  };

  constructor(props) {
    super(props);
    const { delegate } = this.props;
    delegate.bindToComponent(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  componentDidMount() {
    const { delegate } = this.props;
    delegate.componentDidMount();
  }

  componentDidUpdate(prevProps) {
    const { location, delegate } = this.props;
    const { location: prevLocation, status } = prevProps;
    /**
     * If user clicks same nav item they are already on (same pathname but different key)
     * search again to refresh results.
     */
    if (
      prevLocation.pathname === location.pathname
      && prevLocation.key !== location.key
      && status === STATUS_FULFILLED
    ) {
      delegate.bindToComponent(this);
      delegate.handleRefresh();
    }
  }

  componentWillUnmount() {
    const { delegate } = this.props;
    delegate.componentWillUnmount();
  }

  handleRefresh() {
    const { delegate } = this.props;
    delegate.bindToComponent(this);
    delegate.handleRefresh();
  }

  render() {
    const { exception, response, status, title } = this.props;
    const isFulfilled = status === STATUS_FULFILLED;

    return (
      <Card shadow>
        <CardHeader className="pr-2">
          {title}
          <Button onClick={this.handleRefresh} size="sm">
            <Icon imgSrc="refresh" noborder />
          </Button>
        </CardHeader>
        <CardBody className="pl-0 pr-0 pt-0 pb-0">
          {!isFulfilled ? <StatusMessage status={status} exception={exception} /> : (
            <Table className="table-stretch table-sm" borderless hover responsive>
              <thead>
                <tr>
                  <th style={{ width: '1px' }} />
                  <th>Title</th>
                  <th />
                  <th>Slotting</th>
                  <th>Order Date</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {response.get('nodes', []).map((article, idx) => (
                  <TableRow
                    article={article}
                    idx={idx}
                    key={article.get('_id')}
                  />
                ))}
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(TopArticles);
