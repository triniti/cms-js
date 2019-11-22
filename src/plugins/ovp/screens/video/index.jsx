import { connect } from 'react-redux';
import AbstractNodeScreen from '@triniti/cms/plugins/ncr/screens/node';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import delegateFactory from '@triniti/cms/plugins/ovp/screens/video/delegate';
import Form from '@triniti/cms/plugins/ovp/screens/video/Form';
import MediaLiveChannelStatus from '@triniti/cms/plugins/ovp/components/medialive-channel-status';
import React from 'react';
import selector from '@triniti/cms/plugins/ovp/screens/video/selector';

class VideoScreen extends AbstractNodeScreen {
  getForm() {
    return Form;
  }

  getTabs() {
    return [
      'details',
      'taxonomy',
      this.props.delegate.getSchemas().node.hasMixin('triniti:common:mixin:seo') && 'seo',
      'media',
    ];
  }

  renderSidebar() {
    return [
      this.renderPreviewButtons(),
      this.renderNodeStatus(),
      this.renderPublishForm(),
      this.props.delegate.getSchemas().node.hasMixin('triniti:ovp.medialive:mixin:has-channel') && <MediaLiveChannelStatus key="medialive-channel-status" node={this.props.delegate.getNode()} />,
      this.renderChat(),
    ];
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(VideoScreen);
