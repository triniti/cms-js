import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';

import Message from '@gdbots/pbj/Message';
import NotificationFields from '@triniti/cms/plugins/notify/components/notification-fields';
import PicklistPickerField from '@triniti/cms/plugins/sys/components/picklist-picker-field';
import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';

const IosNotificationFields = (props) => {
  const { isEditMode } = props;

  return (
    <>
      <NotificationFields {...props} />
      <Card>
        <CardHeader>Notification Options</CardHeader>
        <CardBody>
          <Field
            component={PicklistPickerField}
            isEditMode={isEditMode}
            label="FCM Topics"
            multi
            name="fcmTopics"
            picklistId="ios-notification-fcm-topics"
          />
        </CardBody>
      </Card>
    </>
  );
};

IosNotificationFields.propTypes = {
  app: PropTypes.instanceOf(Message).isRequired,
  content: PropTypes.instanceOf(Message),
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
  showDatePicker: PropTypes.bool,
};

IosNotificationFields.defaultProps = {
  content: null,
  isEditMode: false,
  showDatePicker: false,
};

export default IosNotificationFields;
