import PropTypes from 'prop-types';
import React from 'react';
import { reduxForm } from 'redux-form';

import History from '@triniti/cms/plugins/pbjx/components/history';
import Message from '@gdbots/pbj/Message';
import RawContent from '@triniti/cms/components/raw-content';
import RolesList from '@triniti/cms/plugins/iam/components/roles-list';
import RolesPicker from '@triniti/cms/plugins/iam/components/roles-picker';
import UserFields from '@triniti/cms/plugins/iam/components/user-fields';
import setBlocks from '@triniti/cms/plugins/blocksmith/utils/setBlocks';

import schemas from './schemas';

const Form = ({ form, getNodeRequestState, node: user, tab, isEditMode }) => {
  switch (tab) {
    case 'roles':
      if (isEditMode) {
        return <RolesPicker node={user} schemas={schemas} />;
      }

      return <RolesList roles={user.get('roles', [])} />;

    case 'history':
      return (
        <History
          isEditMode={isEditMode}
          formName={form}
          node={user}
          nodeRequest={getNodeRequestState.request}
          schema={schemas.getNodeHistory}
          setBlocks={setBlocks}
        />
      );

    case 'raw':
      return <RawContent pbj={user} />;

    default:
      return <UserFields user={user} isEditMode={isEditMode} />;
  }
};

Form.propTypes = {
  getNodeRequestState: PropTypes.shape({
    request: PropTypes.instanceOf(Message).isRequired,
  }).isRequired,
  isEditMode: PropTypes.bool,
  tab: PropTypes.string,
  node: PropTypes.instanceOf(Message).isRequired,
};

Form.defaultProps = {
  tab: null,
  isEditMode: false,
};

export default reduxForm()(Form);
