import { reduxForm } from 'redux-form';
import createLazyComponent from '@triniti/admin-ui-plugin/components/createLazyComponent';
import History from '@triniti/cms/plugins/pbjx/components/history';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import RawContent from '@triniti/cms/components/raw-content';
import React from 'react';
import StreamId from '@gdbots/schemas/gdbots/pbjx/StreamId';
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
    case 'alexa-notification':
      return createLazyComponent(import('@triniti/cms/plugins/notify/components/alexa-notification-fields'));
    case 'android-notification':
      return createLazyComponent(import('@triniti/cms/plugins/notify/components/android-notification-fields'));
    case 'apple-news-notification':
      return createLazyComponent(import('@triniti/cms/plugins/notify/components/apple-news-notification-fields'));
    case 'browser-notification':
      return createLazyComponent(import('@triniti/cms/plugins/notify/components/browser-notification-fields'));
    case 'email-notification':
      return createLazyComponent(import('@triniti/cms/plugins/notify/components/email-notification-fields'));
    case 'ios-notification':
      return createLazyComponent(import('@triniti/cms/plugins/notify/components/ios-notification-fields'));
    case 'slack-notification':
      return createLazyComponent(import('@triniti/cms/plugins/notify/components/slack-notification-fields'));
    case 'sms-notification':
      return createLazyComponent(import('@triniti/cms/plugins/notify/components/sms-notification-fields'));
    default:
      return null;
  }
};

const Form = ({ node, getNode, tab, type, isEditMode, showDatePicker }) => {
  const streamId = StreamId.fromString(
    `${node.schema().getCurie().getMessage()}.history:${node.get('_id')}`,
  );
  const Fields = type ? getFieldsComponent(type) : null;

  switch (tab) {
    case 'history':
      return <History schema={schemas.getNodeHistoryRequest} streamId={streamId} />;

    case 'raw':
      return <RawContent pbj={node} />;

    default:
      return (
        <>
          {type
            ? (
              <Fields
                app={getNode(node.get('app_ref'))}
                content={getNode(node.get('content_ref'))}
                isEditMode={isEditMode}
                node={node}
                showDatePicker={showDatePicker}
              />
            ) : `cannot load fields component since ${type} is passed for notification type value`}
        </>
      );
  }
};

Form.propTypes = {
  getNode: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
  showDatePicker: PropTypes.bool,
  tab: PropTypes.string,
  type: PropTypes.string.isRequired,
};

Form.defaultProps = {
  isEditMode: true,
  showDatePicker: false,
  tab: 'details',
};

export default reduxForm()(Form);
