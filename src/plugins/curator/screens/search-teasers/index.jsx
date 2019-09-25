import React from 'react';
import { connect } from 'react-redux';
import { CreateModalButton } from '@triniti/admin-ui-plugin/components';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import AbstractSearchNodesScreen from '@triniti/cms/plugins/ncr/screens/search-nodes';
import TeasersTable from '@triniti/cms/plugins/curator/components/teasers-table';
import SearchTeasersForm from '@triniti/cms/plugins/curator/components/search-teasers-form';
import CreateTeaserModal from '@triniti/cms/plugins/curator/components/create-teaser-modal';

import selector from './selector';
import delegateFactory from './delegate';

class SearchTeasersScreen extends AbstractSearchNodesScreen {
  getSearchNodesForm() {
    return SearchTeasersForm;
  }

  getNodesTable() {
    return TeasersTable;
  }

  getSearchNodesFormRenderProps() {
    const { disabled, delegate, sort, statuses, types, getNode } = this.props;
    const { selectedRows } = this.state;

    return {
      disabled,
      getNode,
      onUnSelectAllRows: this.handleUnSelectAllRows,
      schemas: delegate.getSchemas(),
      sort,
      statuses,
      selectedRows,
      types,
    };
  }

  renderPrimaryActions() {
    return (
      <CreateModalButton
        className="btn-action-create"
        modal={CreateTeaserModal}
        text="Create Teaser"
      />
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(SearchTeasersScreen);
