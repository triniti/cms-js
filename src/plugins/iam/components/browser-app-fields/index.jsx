import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import TextField from '@triniti/cms/components/text-field';
import TextareaField from '@triniti/cms/components/textarea-field';
import { Card, CardBody } from '@triniti/admin-ui-plugin/components';

const BrowserAppFields = ({ isEditMode }) => (
  <Card>
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
        label="FCM Api Key"
        name="fcmApiKey"
        placeholder="Enter encrypted value"
        readOnly={!isEditMode}
      />
      <Field
        component={TextField}
        label="FCM Project ID"
        name="fcmProjectId"
        placeholder="Enter value"
        readOnly={!isEditMode}
      />
      <Field
        component={TextField}
        label="FCM Sender ID"
        name="fcmSenderId"
        placeholder="Enter value"
        readOnly={!isEditMode}
      />
      <Field
        component={TextField}
        label="FCM Web Api Key"
        name="fcmWebApiKey"
        placeholder="Enter un-encrypted web api key"
        readOnly={!isEditMode}
      />
    </CardBody>
  </Card>
);

BrowserAppFields.propTypes = {
  isEditMode: PropTypes.bool,
};

BrowserAppFields.defaultProps = {
  isEditMode: false,
};

export default BrowserAppFields;
