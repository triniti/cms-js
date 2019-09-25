import React from 'react';
import { connect } from 'react-redux';

import { CreateModalButton } from '@triniti/admin-ui-plugin/components';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import SponsorsTable from '@triniti/cms/plugins/boost/components/sponsors-table';
import AbstractSearchNodesScreen from '@triniti/cms/plugins/ncr/screens/search-nodes';
import SearchSponsorsForm from '@triniti/cms/plugins/boost/components/search-sponsors-form';
import Modal from '@triniti/cms/plugins/boost/components/create-sponsor-modal';

import selector from './selector';
import delegateFactory from './delegate';

class SearchSponsorsScreen extends AbstractSearchNodesScreen {
  getSearchNodesForm() {
    return SearchSponsorsForm;
  }

  getNodesTable() {
    return SponsorsTable;
  }

  renderPrimaryActions() {
    return (
      <CreateModalButton
        className="btn-action-create"
        text="Create Sponsor"
        modal={Modal}
      />
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(SearchSponsorsScreen);
