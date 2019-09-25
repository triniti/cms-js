import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import AbstractSearchNodesScreen from '@triniti/cms/plugins/ncr/screens/search-nodes';
import AssetsTable from '@triniti/cms/plugins/dam/components/assets-table';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import SearchAssetsForm from '@triniti/cms/plugins/dam/components/search-assets-form';
import UploaderButton from '@triniti/cms/plugins/dam/components/uploader-button';

import delegateFactory from './delegate';
import selector from './selector';

class SearchAssetsScreen extends AbstractSearchNodesScreen {
  static propTypes = {
    ...AbstractSearchNodesScreen.propTypes,
    disabled: PropTypes.bool.isRequired,
    sort: PropTypes.string.isRequired,
    statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
    types: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  getSearchNodesForm() {
    return SearchAssetsForm;
  }

  getNodesTable() {
    return AssetsTable;
  }

  getSearchNodesFormRenderProps() {
    const { delegate, disabled, sort, statuses, types, getNode } = this.props;
    const { selectedRows } = this.state;

    return {
      disabled,
      getNode,
      schemas: delegate.getSchemas(),
      onUnSelectAllRows: this.handleUnSelectAllRows,
      selectedRows,
      sort,
      statuses,
      types,
    };
  }

  renderPrimaryActions() {
    return (
      <UploaderButton
        onClose={(processedFileAssets) => processedFileAssets && this.handleCloseModal()}
      />
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(SearchAssetsScreen);
