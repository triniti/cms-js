import PropTypes from 'prop-types';
import React from 'react';
import { Field, FieldArray } from 'redux-form';
import KeyValuesField from '@triniti/cms/components/key-values-field';
import NumberField from '@triniti/cms/components/number-field';
import TextAreaField from '@triniti/cms/components/textarea-field';
import TextField from '@triniti/cms/components/text-field';
import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';

const EmailAppFields = ({ isEditMode }) => (
  <>
    <Card>
      <CardHeader>Details</CardHeader>
      <CardBody indent>
        <Field
          component={TextField}
          label="Title"
          name="title"
          placeholder="Enter title"
          readOnly={!isEditMode}
        />
      </CardBody>
    </Card>
    <Card>
      <CardHeader>Configuration</CardHeader>
      <CardBody indent>
        <Field
          component={TextAreaField}
          label="Sendgrid Api Key"
          name="sendgridApiKey"
          placeholder="Enter an encrypted SendGrid Api key"
          readOnly={!isEditMode}
        />
        <FieldArray
          component={KeyValuesField}
          keyPlaceholder="Slug"
          label="SendGrid Lists"
          name="sendgridLists"
          readOnly={!isEditMode}
          type="List"
          valuePlaceholder="ID"
          valueType="number"
        />
        <FieldArray
          component={KeyValuesField}
          keyPlaceholder="Email Address"
          label="SendGrid Senders"
          name="sendgridSenders"
          readOnly={!isEditMode}
          type="Sender"
          valuePlaceholder="ID"
          valueType="number"
        />
        <Field
          component={NumberField}
          label="SendGrid Suppression Group ID"
          name="sendgridSuppressionGroupId"
          readOnly={!isEditMode}
        />
      </CardBody>
    </Card>
  </>
);

EmailAppFields.propTypes = {
  isEditMode: PropTypes.bool,
};

EmailAppFields.defaultProps = {
  isEditMode: false,
};

export default EmailAppFields;
