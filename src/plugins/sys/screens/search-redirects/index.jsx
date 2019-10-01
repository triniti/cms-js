import React from 'react';
import { connect } from 'react-redux';

import { CreateModalButton } from '@triniti/admin-ui-plugin/components';
import AbstractSearchNodesScreen from '@triniti/cms/plugins/ncr/screens/search-nodes';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import RedirectsTable from '@triniti/cms/plugins/sys/components/redirects-table';
import SearchRedirectsForm from '@triniti/cms/plugins/sys/components/search-redirects-form';
import CreateRedirectModal from '@triniti/cms/plugins/sys/components/create-redirect-modal';

import delegateFactory from './delegate';
import selector from './selector';

/* eslint-disable class-methods-use-this */
class SearchRedirectsScreen extends AbstractSearchNodesScreen {
  getSearchNodesForm() {
    return SearchRedirectsForm;
  }

  getNodesTable() {
    return RedirectsTable;
  }

  renderPrimaryActions() {
    return (
      <CreateModalButton
        className="btn-action-create"
        modal={CreateRedirectModal}
        text="Create Redirect"
      />
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(SearchRedirectsScreen);
