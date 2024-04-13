import React from 'react';
import { Card, CardBody, CardHeader, CardText } from 'reactstrap';
import { EncryptedField, KeyValuesField, NumberField } from '@triniti/cms/components';

export default function EmailAppFields() {
  return (
    <Card>
      <CardHeader>SendGrid Configuration</CardHeader>
      <CardBody className="pb-0">
        <CardText className="pb-2">
          Reference <a href="https://docs.sendgrid.com/ui/account-and-settings/api-keys" rel="noopener noreferrer" target="_blank">SendGrid API Keys</a>.
        </CardText>
        <EncryptedField name="sendgrid_api_key" label="API Key" />
        <NumberField name="sendgrid_suppression_group_id" label="Suppression Group ID" />
        <KeyValuesField name="sendgrid_senders" label="Senders" component={NumberField} />
        <KeyValuesField name="sendgrid_lists" label="Lists" component={NumberField} />
      </CardBody>
    </Card>
  );
}
