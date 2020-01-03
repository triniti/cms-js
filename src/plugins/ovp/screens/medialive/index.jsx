import { connect } from 'react-redux';
import { Screen, Spinner, StatusMessage } from '@triniti/admin-ui-plugin/components';
import MediaLiveChannelCards from '@triniti/cms/plugins/ovp/components/medialive-channel-cards';
import Message from '@gdbots/pbj/Message';
import React from 'react';
import PropTypes from 'prop-types';
import delegate from './delegate';
import selector from './selector';

class MediaLiveScreen extends React.Component {
  static propTypes = {
    alerts: PropTypes.arrayOf(PropTypes.object),
    exception: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    isFulfilled: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    nodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
    handleSearch: PropTypes.func.isRequired,
    status: PropTypes.string.isRequired,
  };

  static defaultProps = {
    alerts: [],
    exception: null,
  };

  componentDidMount() {
    const { handleSearch } = this.props;
    handleSearch();
  }

  render() {
    const { alerts, exception, isFulfilled, match: { url }, nodes, status } = this.props;
    const urlParts = url.split('/');
    return (
      <Screen
        alerts={alerts}
        breadcrumbs={[
          {
            to: `/${urlParts[1]}/${urlParts[2]}`,
            text: 'Videos',
          },
          {
            text: 'Livestreams',
          },
        ]}
        body={(() => {
          if (exception) {
            return <StatusMessage status={status} exception={exception} />;
          }
          if (!isFulfilled) {
            return <Spinner />;
          }
          return nodes.length === 0
            ? <p>No videos with MediaLive Channels found.</p>
            : <MediaLiveChannelCards nodes={nodes} />;
        })()}
        title="Livestreams"
      />
    );
  }
}

export default connect(selector, delegate)(MediaLiveScreen);
