import React from 'react';
import { connect } from 'react-redux';

import { CreateModalButton } from '@triniti/admin-ui-plugin/components';
import AbstractSearchNodesScreen from '@triniti/cms/plugins/ncr/screens/search-nodes';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import PollsTable from '@triniti/cms/plugins/apollo/components/polls-table';
import SearchPollsForm from '@triniti/cms/plugins/apollo/components/search-polls-form';
import Modal from '@triniti/cms/plugins/apollo/components/create-poll-modal';

import delegateFactory from './delegate';
import selector from './selector';

class SearchPollsScreen extends AbstractSearchNodesScreen {
  getSearchNodesForm() {
    return SearchPollsForm;
  }

  getNodesTable() {
    return PollsTable;
  }

  renderPrimaryActions() {
    return (
      <CreateModalButton
        className="btn-action-create"
        modal={Modal}
        text="Create Poll"
      />
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(SearchPollsScreen);
