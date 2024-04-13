import React from 'react';
import { Card, CardBody, CardHeader, CardText } from 'reactstrap';
import { EncryptedField, TextField } from '@triniti/cms/components';

export default function AzureFields() {
  return (
    <Card>
      <CardHeader>Azure Configuration</CardHeader>
      <CardBody>
        <CardText className="pb-2">
          These values come from an <a href="https://docs.microsoft.com/en-us/azure/notification-hubs/notification-hubs-push-notification-overview" rel="noopener noreferrer" target="_blank">Azure Notification Hub</a> configuration.
        </CardText>
        <TextField name="azure_notification_hub_name" label="Hub Name" />
        <EncryptedField name="azure_notification_hub_connection" label="Hub Connection String" />
      </CardBody>
    </Card>
  );
}
