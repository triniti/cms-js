import React from 'react';
import AbstractSearchNodesScreen from '@triniti/cms/plugins/ncr/screens/search-nodes';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import { connect } from 'react-redux';

import { CreateModalButton } from '@triniti/admin-ui-plugin/components';
import SearchVideosForm from '@triniti/cms/plugins/ovp/components/search-videos-form';
import VideosTable from '@triniti/cms/plugins/ovp/components/videos-table';
import CreateVideoModal from '@triniti/cms/plugins/ovp/components/create-video-modal';

import delegateFactory from './delegate';
import selector from './selector';

class SearchVideosScreen extends AbstractSearchNodesScreen {
  getSearchNodesForm() {
    return SearchVideosForm;
  }

  getNodesTable() {
    return VideosTable;
  }

  renderPrimaryActions() {
    return (
      <CreateModalButton
        className="btn-action-create"
        modal={CreateVideoModal}
        text="Create Video"
      />
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(SearchVideosScreen);
