import React from 'react';
import { connect } from 'react-redux';

import { CreateModalButton } from '@triniti/admin-ui-plugin/components';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import WidgetsTable from '@triniti/cms/plugins/curator/components/widgets-table';
import SearchWidgetsForm from '@triniti/cms/plugins/curator/components/search-widgets-form';
import CreateWidgetModal from '@triniti/cms/plugins/curator/components/create-widget-modal';
import AbstractSearchNodesScreen from '@triniti/cms/plugins/ncr/screens/search-nodes';

import selector from './selector';
import delegateFactory from './delegate';

class SearchWidgetsScreen extends AbstractSearchNodesScreen {
  getSearchNodesForm() {
    return SearchWidgetsForm;
  }

  getNodesTable() {
    return WidgetsTable;
  }

  getSearchNodesFormRenderProps() {
    const { delegate, disabled, sort, statuses, types } = this.props;
    const { selectedRows } = this.state;

    return {
      disabled,
      schemas: delegate.getSchemas(),
      selectedRows,
      sort,
      statuses,
      types,
    };
  }

  renderPrimaryActions() {
    return (
      <CreateModalButton
        className="btn-action-create"
        modal={CreateWidgetModal}
        text="Create Widget"
      />
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(SearchWidgetsScreen);
