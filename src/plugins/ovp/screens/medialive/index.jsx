import { connect } from 'react-redux';
import { Screen, Spinner, StatusMessage } from '@triniti/admin-ui-plugin/components';
import MediaLiveChannelCards from '@triniti/cms/plugins/ovp/components/medialive-channel-cards';
import React from 'react';
import delegate from './delegate';
import selector from './selector';

class MediaLiveScreen extends React.Component {
  componentDidMount() {
    const { handleSearch } = this.props;
    handleSearch();
  }

  render() {
    const { exception, isFulfilled, match: { url }, nodes, status } = this.props;
    const urlParts = url.split('/');
    console.log('here', this.props);
    return (
      <Screen
        breadcrumbs={[
          {
            to: `/${urlParts[1]}/${urlParts[2]}`,
            text: 'Videos',
          },
          {
            text: 'Livestream',
          },
        ]}
        body={(() => {
          if (exception) {
            return <StatusMessage status={status} exception={exception} />;
          }
          return isFulfilled ? <MediaLiveChannelCards nodes={nodes} /> : <Spinner />;
        })()}
      />
    );
  }
}

export default connect(selector, delegate)(MediaLiveScreen);
