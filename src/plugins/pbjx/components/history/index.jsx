import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import Message from '@gdbots/pbj/Message';
import EventStream from '../event-stream';
import selector from './selector';
import delegateFactory from './delegate';

class History extends React.Component {
  static propTypes = {
    delegate: PropTypes.shape({
      handleInitialize: PropTypes.func,
      handleLoadMore: PropTypes.func,
      handleRevert: PropTypes.func,
    }).isRequired,
    events: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
    getHistoryRequestState: PropTypes.shape({
      exception: PropTypes.object,
      request: PropTypes.object,
      response: PropTypes.object,
      status: PropTypes.string,
    }).isRequired,
    isEditMode: PropTypes.bool.isRequired,
    getUser: PropTypes.func.isRequired,
    formName: PropTypes.string.isRequired,
    node: PropTypes.instanceOf(Message).isRequired,
  };

  static defaultProps = {
    events: [],
  };

  componentDidMount() {
    const { delegate } = this.props;
    delegate.handleInitialize();
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
      isRevertGranted,
      getUser,
      getHistoryRequestState: { response, status, exception },
      formName,
      node,
    } = this.props;

    return (
      <EventStream
        events={events}
        getUser={getUser}
        formName={formName}
        node={node}
        status={status}
        isEditMode={isEditMode}
        isRevertGranted={isRevertGranted}
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
