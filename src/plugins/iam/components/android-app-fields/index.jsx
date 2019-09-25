import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import TextareaField from '@triniti/cms/components/textarea-field';
import TextField from '@triniti/cms/components/text-field';
import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';

const AndroidAppFields = ({ isEditMode }) => (
  <Card>
    <CardHeader>Details</CardHeader>
    <CardBody indent>
      <Field
        component={TextField}
        label="Title"
        name="title"
        placeholder="Enter Title"
        readOnly={!isEditMode}
      />
      <Field
        component={TextareaField}
        label="Azure Notification Hub Connection String"
        name="azureNotificationHubConnection"
        placeholder="Enter encrypted connection string value"
        readOnly={!isEditMode}
      />
      <Field
        component={TextField}
        label="Azure Notification Hub Name"
        name="azureNotificationHubName"
        placeholder="Enter notification hub name"
        readOnly={!isEditMode}
      />
      <Field
        component={TextareaField}
        label="FCM Api Key"
        name="fcmApiKey"
        placeholder="Enter encrypted value"
        readOnly={!isEditMode}
      />
    </CardBody>
  </Card>
);

AndroidAppFields.propTypes = {
  isEditMode: PropTypes.bool,
};

AndroidAppFields.defaultProps = {
  isEditMode: false,
};

export default AndroidAppFields;
