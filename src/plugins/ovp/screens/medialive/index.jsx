import { connect } from 'react-redux';
import React from 'react';
import {
  ActionButton,
  Alert,
  DropdownMenu,
  DropdownToggle,
  Icon,
  InputGroup,
  InputGroupButtonDropdown,
  Screen,
  Spinner,
  StatusMessage,
  UncontrolledDropdown,
} from '@triniti/admin-ui-plugin/components';
import MedialiveChannelCards from '@triniti/cms/plugins/ovp/components/medialive-channel-cards';
import delegate from './delegate';
import selector from './selector';

// todo: force error on server (frozen etc) and display status message

class MediaLiveScreen extends React.Component {
  componentDidMount() {
    const { handleSearch } = this.props;
    handleSearch();
  }

  render() {
    const { isFulfilled, match: { url }, nodes } = this.props;
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
        body={isFulfilled ? <MedialiveChannelCards nodes={nodes} /> : <Spinner />}
      />
    );
  }
}

export default connect(selector, delegate)(MediaLiveScreen);
