import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { CreateModalButton, Screen, Spinner } from '@triniti/admin-ui-plugin/components';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import CreateChannelModal from '@triniti/cms/plugins/taxonomy/components/create-channel-modal';
import ListAllChannels from '@triniti/cms/plugins/taxonomy/components/channels-list';
import Message from '@gdbots/pbj/Message';

import schemas from './schemas';
import selector from './selector';

class GetAllChannels extends React.Component {
  static propTypes = {
    alerts: PropTypes.arrayOf(PropTypes.any),
    channels: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
    dispatch: PropTypes.func.isRequired,
    isFulfilled: PropTypes.bool,
  };

  static defaultProps = {
    alerts: [],
    channels: [],
    isFulfilled: false,
  };

  constructor(props) {
    super(props);
    const { dispatch, isFulfilled } = this.props;

    if (!isFulfilled) {
      dispatch(schemas.listAllChannels.createMessage());
    }
  }

  render() {
    const {
      alerts,
      channels,
      dispatch,
      isFulfilled,
    } = this.props;

    if (!isFulfilled) {
      return <Spinner className="p-4" />;
    }

    return (
      <Screen
        title="Channels"
        alerts={alerts}
        breadcrumbs={[
          { text: 'Channels' },
        ]}
        dispatch={dispatch}
        maxWidth="768px"
        primaryActions={(
          <CreateModalButton
            className="btn-action-create"
            modal={CreateChannelModal}
            text="Create Channel"
          />
        )}
        body={
          <ListAllChannels channels={channels} />
        }
      />
    );
  }
}

export default connect(selector, createDelegateFactory(() => {}))(GetAllChannels);
