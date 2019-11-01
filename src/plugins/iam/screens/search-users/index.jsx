import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { CreateModalButton } from '@triniti/admin-ui-plugin/components';
import AbstractSearchNodesScreen from '@triniti/cms/plugins/ncr/screens/search-nodes';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import SearchUsersForm from '@triniti/cms/plugins/iam/components/search-users-form';
import UsersTable from '@triniti/cms/plugins/iam/components/users-table';
import Modal from '@triniti/cms/plugins/iam/components/create-user-modal';

import delegateFactory from './delegate';
import selector from './selector';

class SearchUsersScreen extends AbstractSearchNodesScreen {
  static propTypes = {
    ...AbstractSearchNodesScreen.propTypes,
    isStaff: PropTypes.number,
    status: PropTypes.string.isRequired,
  };

  static defaultProps = {
    ...AbstractSearchNodesScreen.defaultProps,
    isStaff: 0,
  };

  getSearchNodesForm() {
    return SearchUsersForm;
  }

  getSearchNodesFormRenderProps() {
    const { isStaff, q, status } = this.props;

    return { isStaff, q, status };
  }

  getNodesTable() {
    return UsersTable;
  }

  renderPrimaryActions() {
    return (
      <CreateModalButton
        className="btn-action-create"
        modal={Modal}
        text="Create User"
      />
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(SearchUsersScreen);
