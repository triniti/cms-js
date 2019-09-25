import React from 'react';
import { connect } from 'react-redux';

import { CreateModalButton } from '@triniti/admin-ui-plugin/components';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import PromotionsTable from '@triniti/cms/plugins/curator/components/promotions-table';
import SearchPromotionsForm from '@triniti/cms/plugins/curator/components/search-promotions-form';
import Modal from '@triniti/cms/plugins/curator/components/create-promotion-modal';
import AbstractSearchNodesScreen from '@triniti/cms/plugins/ncr/screens/search-nodes';

import selector from './selector';
import delegateFactory from './delegate';

class SearchPromotionsScreen extends AbstractSearchNodesScreen {
  getSearchNodesForm() {
    return SearchPromotionsForm;
  }

  getNodesTable() {
    return PromotionsTable;
  }

  renderPrimaryActions() {
    return (
      <CreateModalButton
        className="btn-action-create"
        modal={Modal}
        text="Create Promotion"
      />
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(SearchPromotionsScreen);
