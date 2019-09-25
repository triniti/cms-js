import React from 'react';
import { connect } from 'react-redux';

import { CreateModalButton } from '@triniti/admin-ui-plugin/components';
import AbstractSearchNodesScreen from '@triniti/cms/plugins/ncr/screens/search-nodes';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import PeopleTable from '@triniti/cms/plugins/people/components/people-table';
import PersonCards from '@triniti/cms/plugins/people/components/person-cards';
import SearchPeopleForm from '@triniti/cms/plugins/people/components/search-people-form';
import CreatePersonModal from '@triniti/cms/plugins/people/components/create-person-modal';

import delegateFactory from './delegate';
import selector from './selector';

class SearchPeopleScreen extends AbstractSearchNodesScreen {
  getSearchNodesForm() {
    return SearchPeopleForm;
  }

  getNodesTable() {
    return PeopleTable;
  }

  getNodeCards() {
    return PersonCards;
  }

  renderPrimaryActions() {
    return (
      <CreateModalButton
        className="btn-action-create"
        modal={CreatePersonModal}
        text="Create Person"
      />
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(SearchPeopleScreen);
