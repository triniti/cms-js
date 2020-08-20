import PropTypes from 'prop-types';
import React from 'react';
import { reduxForm } from 'redux-form';

import History from '@triniti/cms/plugins/pbjx/components/history';
import Message from '@gdbots/pbj/Message';
import MessageResolver from '@gdbots/pbj/MessageResolver';
import RawContent from '@triniti/cms/components/raw-content';
import RoleFields from '@triniti/cms/plugins/iam/components/role-fields';

import schemas from './schemas';

const Form = ({ form, getNodeRequestState, node: role, tab, isEditMode }) => {
  switch (tab) {
    case 'history':
      return (
        <History
          isEditMode={isEditMode}
          formName={form}
          node={role}
          nodeRequest={getNodeRequestState.request}
          schema={schemas.getNodeHistory}
        />
      );

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
  getNodeRequestState: PropTypes.shape({
    request: PropTypes.instanceOf(Message).isRequired,
  }).isRequired,
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
  tab: PropTypes.string,
};

Form.defaultProps = {
  isEditMode: true,
  tab: '',
};

export default reduxForm()(Form);
