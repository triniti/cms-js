import React from 'react';
import { connect } from 'react-redux';

import { CreateModalButton } from '@triniti/admin-ui-plugin/components';
import AbstractSearchNodesScreen from '@triniti/cms/plugins/ncr/screens/search-nodes';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import SearchPagesForm from '@triniti/cms/plugins/canvas/components/search-pages-form';
import PagesTable from '@triniti/cms/plugins/canvas/components/pages-table';
import PageCards from '@triniti/cms/plugins/canvas/components/page-cards';
import Modal from '@triniti/cms/plugins/canvas/components/create-page-modal';

import delegateFactory from './delegate';
import selector from './selector';

class SearchPagesScreen extends AbstractSearchNodesScreen {
  getSearchNodesForm() {
    return SearchPagesForm;
  }

  getNodesTable() {
    return PagesTable;
  }

  getNodeCards() {
    return PageCards;
  }

  renderPrimaryActions() {
    return (
      <CreateModalButton
        className="btn-action-create"
        modal={Modal}
        text="Create Page"
      />
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(SearchPagesScreen);
