import PropTypes from 'prop-types';
import React from 'react';
import { reduxForm } from 'redux-form';

import History from '@triniti/cms/plugins/pbjx/components/history';
import Message from '@gdbots/pbj/Message';
import RawContent from '@triniti/cms/components/raw-content';
import RolesList from '@triniti/cms/plugins/iam/components/roles-list';
import RolesPicker from '@triniti/cms/plugins/iam/components/roles-picker';
import StreamId from '@gdbots/schemas/gdbots/pbjx/StreamId';
import UserFields from '@triniti/cms/plugins/iam/components/user-fields';

import schemas from './schemas';

const Form = ({ node: user, tab, isEditMode }) => {
  const streamId = StreamId.fromString(`user.history:${user.get('_id')}`);
  switch (tab) {
    case 'roles':
      if (isEditMode) {
        return <RolesPicker node={user} schemas={schemas} />;
      }

      return <RolesList roles={user.get('roles', [])} />;

    case 'history':
      return <History schema={schemas.getNodeHistory} streamId={streamId} />;

    case 'raw':
      return <RawContent pbj={user} />;

    default:
      return <UserFields user={user} isEditMode={isEditMode} />;
  }
};

Form.propTypes = {
  isEditMode: PropTypes.bool,
  tab: PropTypes.string,
  node: PropTypes.instanceOf(Message).isRequired,
};

Form.defaultProps = {
  tab: null,
  isEditMode: false,
};

export default reduxForm()(Form);
