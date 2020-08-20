import React from 'react';
import { connect } from 'react-redux';

import AbstractNodeScreen from '@triniti/cms/plugins/ncr/screens/node';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import NotificationSendStatus from '@triniti/cms/plugins/notify/components/notification-send-status';

import delegateFactory from './delegate';
import Form from './Form';
import selector from './selector';

class NotificationScreen extends AbstractNodeScreen {
  getForm() {
    return Form;
  }

  getFormRenderProps() {
    const { getNodeRequestState } = this.props;
    return {
      getNode: this.props.getNode,
      getNodeRequestState,
      showDatePicker: this.props.showDatePicker,
      type: this.props.match.params.type,
    };
  }

  getTabs() {
    return [
      'details',
    ];
  }

  renderNodeStatus() {
    const { delegate } = this.props;
    const node = delegate.getNode();
    return node ? <NotificationSendStatus key="NodeStatus" node={node} /> : null;
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(NotificationScreen);
