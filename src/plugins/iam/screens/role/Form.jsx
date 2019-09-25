import PropTypes from 'prop-types';
import React from 'react';
import { reduxForm } from 'redux-form';

import History from '@triniti/cms/plugins/pbjx/components/history';
import Message from '@gdbots/pbj/Message';
import MessageResolver from '@gdbots/pbj/MessageResolver';
import RawContent from '@triniti/cms/components/raw-content';
import RoleFields from '@triniti/cms/plugins/iam/components/role-fields';
import StreamId from '@gdbots/schemas/gdbots/pbjx/StreamId';

import schemas from './schemas';

const Form = ({ node: role, tab, isEditMode }) => {
  const streamId = StreamId.fromString(`role.history:${role.get('_id')}`);
  switch (tab) {
    case 'history':
      return <History schema={schemas.getNodeHistory} streamId={streamId} />;

    case 'raw':
      return <RawContent pbj={role} />;

    default:
      return (
        <RoleFields
          isEditMode={isEditMode}
          options={MessageResolver.all().map((option) => option.schema().getCurie().toString())}
          role={role}
        />
      );
  }
};

Form.propTypes = {
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
  tab: PropTypes.string,
};

Form.defaultProps = {
  isEditMode: true,
  tab: '',
};

export default reduxForm()(Form);
