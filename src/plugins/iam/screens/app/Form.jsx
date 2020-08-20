import { reduxForm } from 'redux-form';
import createLazyComponent from '@triniti/admin-ui-plugin/components/createLazyComponent';
import History from '@triniti/cms/plugins/pbjx/components/history';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import RawContent from '@triniti/cms/components/raw-content';
import React from 'react';
import RolesList from '@triniti/cms/plugins/iam/components/roles-list';
import RolesPicker from '@triniti/cms/plugins/iam/components/roles-picker';
import schemas from './schemas';

/**
 * This cannot use template literals or other expressions because of the module resolver.
 *
 * @link https://github.com/tleunen/babel-plugin-module-resolver/issues/291
 *
 * @param {string} type
 */
const getFieldsComponent = (type) => {
  switch (type) {
    case 'alexa-app':
      return createLazyComponent(import('@triniti/cms/plugins/iam/components/alexa-app-fields'));
    case 'android-app':
      return createLazyComponent(import('@triniti/cms/plugins/iam/components/android-app-fields'));
    case 'apple-news-app':
      return createLazyComponent(import('@triniti/cms/plugins/iam/components/apple-news-app-fields'));
    case 'browser-app':
      return createLazyComponent(import('@triniti/cms/plugins/iam/components/browser-app-fields'));
    case 'email-app':
      return createLazyComponent(import('@triniti/cms/plugins/iam/components/email-app-fields'));
    case 'ios-app':
      return createLazyComponent(import('@triniti/cms/plugins/iam/components/ios-app-fields'));
    case 'slack-app':
      return createLazyComponent(import('@triniti/cms/plugins/iam/components/slack-app-fields'));
    case 'sms-app':
      return createLazyComponent(import('@triniti/cms/plugins/iam/components/sms-app-fields'));
    default:
      return null;
  }
};

const Form = ({ form, getNodeRequestState, node, tab, type, isEditMode }) => {
  const AppFields = type ? getFieldsComponent(type) : null;

  switch (tab) {
    case 'roles':
      if (isEditMode) {
        return <RolesPicker node={node} schemas={schemas} />;
      }

      return <RolesList roles={node.get('roles', [])} />;

    case 'history':
      return (
        <History
          isEditMode={isEditMode}
          formName={form}
          node={node}
          nodeRequest={getNodeRequestState.request}
          schema={schemas.getNodeHistoryRequest}
        />
      );

    case 'raw':
      return <RawContent pbj={node} />;

    default:
      return <AppFields isEditMode={isEditMode} />;
  }
};

Form.propTypes = {
  getNodeRequestState: PropTypes.shape({
    request: PropTypes.instanceOf(Message).isRequired,
  }).isRequired,
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
