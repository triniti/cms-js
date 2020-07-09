import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import noop from 'lodash/noop';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import Message from '@gdbots/pbj/Message';
import Schema from '@gdbots/pbj/Schema';
import EventStream from '../event-stream';
import selector from './selector';
import delegateFactory from './delegate';

class History extends React.Component {
  static propTypes = {
    delegate: PropTypes.shape({
      componentWillUnmount: PropTypes.func,
      handleInitialize: PropTypes.func,
      handleLoadMore: PropTypes.func,
      handleRevert: PropTypes.func,
    }).isRequired,
    events: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
    formValues: PropTypes.shape({}).isRequired,
    getHistoryRequestState: PropTypes.shape({
      exception: PropTypes.object,
      request: PropTypes.object,
      response: PropTypes.object,
      status: PropTypes.string,
    }).isRequired,
    isEditMode: PropTypes.bool.isRequired,
    getUser: PropTypes.func.isRequired,
    schema: PropTypes.instanceOf(Schema).isRequired,
    /* eslint-disable react/no-unused-prop-types */
    setBlocks: PropTypes.func,
  };

  static defaultProps = {
    events: [],
    setBlocks: noop,
  };

  componentDidMount() {
    const { delegate, formValues } = this.props;
    delegate.handleInitialize(formValues);
  }

  componentWillUnmount() {
    // fixme: this component is using a mutant delegate that's half one strategy
    // and half another clean this up and make it consistent.
    const { delegate, schema } = this.props;
    delegate.componentWillUnmount(schema);
  }

  render() {
    const {
      delegate,
      events,
      isEditMode,
      getUser,
      getHistoryRequestState: { response, status, exception },
    } = this.props;

    return (
      <EventStream
        events={events}
        getUser={getUser}
        status={status}
        isEditMode={isEditMode}
        exception={exception}
        response={response}
        onLoadMore={() => delegate.handleLoadMore(response.get('last_occurred_at'))}
        onRefresh={() => delegate.handleInitialize()}
        onRevert={delegate.handleRevert}
      />
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(History);
