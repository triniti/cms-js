import PropTypes from 'prop-types';
import React from 'react';
import memoize from 'lodash/memoize';
import { reduxForm } from 'redux-form';

import createLazyComponent from '@triniti/admin-ui-plugin/components/createLazyComponent';
import History from '@triniti/cms/plugins/pbjx/components/history';
import Message from '@gdbots/pbj/Message';
import RawContent from '@triniti/cms/components/raw-content';
import RolesList from '@triniti/cms/plugins/iam/components/roles-list';
import RolesPicker from '@triniti/cms/plugins/iam/components/roles-picker';
import StreamId from '@gdbots/schemas/gdbots/pbjx/StreamId';

import schemas from './schemas';

// fixme: replace template literal
// const getFieldsComponent = memoize((type) => createLazyComponent(import(`@triniti/cms/plugins/iam/components/${type}-fields`)));

const Form = ({ node, tab, type, isEditMode }) => {
  const AppFields = type ? null : null;
  const streamId = StreamId.fromString(`${type}.history:${node.get('_id')}`);

  switch (tab) {
    case 'roles':
      if (isEditMode) {
        return <RolesPicker node={node} schemas={schemas} />;
      }

      return <RolesList roles={node.get('roles', [])} />;

    case 'history':
      return <History schema={schemas.getNodeHistoryRequest} streamId={streamId} />;

    case 'raw':
      return <RawContent pbj={node} />;

    default:
      return <AppFields isEditMode={isEditMode} />;
  }
};

Form.propTypes = {
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
  tab: PropTypes.string,
  type: PropTypes.string.isRequired,
};

Form.defaultProps = {
  isEditMode: false,
  tab: 'details',
};

export default reduxForm()(Form);
