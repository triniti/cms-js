import React from 'react';
import { connect } from 'react-redux';

import { CreateModalButton } from '@triniti/admin-ui-plugin/components';
import AbstractSearchNodesScreen from '@triniti/cms/plugins/ncr/screens/search-nodes';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import SearchArticlesForm from '@triniti/cms/plugins/news/components/search-articles-form';
import ArticlesTable from '@triniti/cms/plugins/news/components/articles-table';
import Modal from '@triniti/cms/plugins/news/components/create-article-modal';

import delegateFactory from './delegate';
import selector from './selector';

class SearchArticlesScreen extends AbstractSearchNodesScreen {
  getSearchNodesForm() {
    return SearchArticlesForm;
  }

  getNodesTable() {
    return ArticlesTable;
  }

  renderPrimaryActions() {
    return (
      <CreateModalButton
        className="btn-action-create"
        modal={Modal}
        text="Create Article"
      />
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(SearchArticlesScreen);
