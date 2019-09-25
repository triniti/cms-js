import React from 'react';
import { connect } from 'react-redux';

import { CreateModalButton } from '@triniti/admin-ui-plugin/components';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import AbstractSearchNodesScreen from '@triniti/cms/plugins/ncr/screens/search-nodes';
import NotificationsTable from '@triniti/cms/plugins/notify/components/notifications-table';
import SearchNotificationsForm from '@triniti/cms/plugins/notify/components/search-notifications-form';
import Modal from '@triniti/cms/plugins/notify/components/create-notification-modal';

import selector from './selector';
import delegateFactory from './delegate';

class SearchNotificationsScreen extends AbstractSearchNodesScreen {
  getSearchNodesForm() {
    return SearchNotificationsForm;
  }

  getNodesTable() {
    return NotificationsTable;
  }

  getSearchNodesFormRenderProps() {
    const { appRef, allAppOptions, delegate, disabled, sort, sendStatus, getNode } = this.props;

    return {
      allAppOptions,
      appRef,
      disabled,
      getNode,
      schemas: delegate.getSchemas(),
      sort,
      sendStatus,
    };
  }

  renderPrimaryActions() {
    return (
      <CreateModalButton
        className="btn-action-create"
        modal={Modal}
        text="Create Notification"
      />
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(SearchNotificationsScreen);
