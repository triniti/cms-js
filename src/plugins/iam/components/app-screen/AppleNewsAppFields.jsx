import React from 'react';
import { Card, CardBody, CardHeader, CardText } from 'reactstrap';
import { EncryptedField, TextField } from 'components';

export default function AppleNewsAppFields() {
  return (
    <Card>
      <CardHeader>Configuration</CardHeader>
      <CardBody>
        <CardText className="pb-2">
          Reference the <a href="https://developer.apple.com/documentation/apple_news/apple_news_api/about_the_news_security_model" rel="noopener noreferrer" target="_blank">Apple News Security Model</a>.
        </CardText>
        <TextField name="channel_id" label="Channel ID" required />
        <TextField name="api_key" label="API Key" required />
        <EncryptedField name="api_secret" label="API Secret" required />
      </CardBody>
    </Card>
  );
}
