import { connect } from 'react-redux';
import AbstractNodeScreen from '@triniti/cms/plugins/ncr/screens/node';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import delegateFactory from '@triniti/cms/plugins/ovp/screens/video/delegate';
import Form from '@triniti/cms/plugins/ovp/screens/video/Form';
import MediaLiveChannelState from '@triniti/cms/plugins/ovp/components/medialive-channel-state';
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
    const node = this.props.delegate.getNode();
    return [
      this.renderPreviewButtons(),
      this.renderNodeStatus(),
      this.renderPublishForm(),
      node && node.has('medialive_channel_arn') && <MediaLiveChannelState node={node} key="medialive-channel-state" />,
      this.renderChat(),
    ];
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(VideoScreen);
