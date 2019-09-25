import React from 'react';
import { connect } from 'react-redux';

import { CreateModalButton } from '@triniti/admin-ui-plugin/components';
import AbstractSearchNodesScreen from '@triniti/cms/plugins/ncr/screens/search-nodes';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import CategoriesTable from '@triniti/cms/plugins/taxonomy/components/categories-table';
import SearchCategoriesForm from '@triniti/cms/plugins/taxonomy/components/search-categories-form';
import CreateCategoryModal from '@triniti/cms/plugins/taxonomy/components/create-category-modal';

import selector from './selector';
import delegateFactory from './delegate';

class SearchCategoriesScreen extends AbstractSearchNodesScreen {
  getSearchNodesForm() {
    return SearchCategoriesForm;
  }

  getNodesTable() {
    return CategoriesTable;
  }

  renderPrimaryActions() {
    return (
      <CreateModalButton
        className="btn-action-create"
        modal={CreateCategoryModal}
        text="Create Category"
      />
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(SearchCategoriesScreen);
