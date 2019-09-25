import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { CreateModalButton } from '@triniti/admin-ui-plugin/components';
import AbstractSearchNodesScreen from '@triniti/cms/plugins/ncr/screens/search-nodes';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import Modal from '@triniti/cms/plugins/curator/components/create-gallery-modal';
import SearchGalleriesForm from '@triniti/cms/plugins/curator/components/search-galleries-form';
import GalleriesTable from '@triniti/cms/plugins/curator/components/galleries-table';

import delegateFactory from './delegate';
import selector from './selector';

class SearchGalleriesScreen extends AbstractSearchNodesScreen {
  static propTypes = {
    ...AbstractSearchNodesScreen.propTypes,
    disabled: PropTypes.bool.isRequired,
    sort: PropTypes.string.isRequired,
    statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  getSearchNodesForm() {
    return SearchGalleriesForm;
  }

  getNodesTable() {
    return GalleriesTable;
  }

  renderPrimaryActions() {
    return (
      <CreateModalButton
        className="btn-action-create"
        text="Create Gallery"
        modal={Modal}
      />
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(SearchGalleriesScreen);
