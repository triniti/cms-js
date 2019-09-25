import React from 'react';
import { connect } from 'react-redux';

import { CreateModalButton } from '@triniti/admin-ui-plugin/components';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import AbstractSearchNodesScreen from '@triniti/cms/plugins/ncr/screens/search-nodes';
import TimelinesTable from '@triniti/cms/plugins/curator/components/timelines-table';
import SearchTimelinesForm from '@triniti/cms/plugins/curator/components/search-timelines-form';
import Modal from '@triniti/cms/plugins/curator/components/create-timeline-modal';
import selector from './selector';
import delegateFactory from './delegate';

class SearchTimelinesScreen extends AbstractSearchNodesScreen {
  getSearchNodesForm() {
    return SearchTimelinesForm;
  }

  getNodesTable() {
    return TimelinesTable;
  }

  renderPrimaryActions() {
    return (
      <CreateModalButton
        className="btn-action-create"
        modal={Modal}
        text="Create Timeline"
      />
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(SearchTimelinesScreen);
