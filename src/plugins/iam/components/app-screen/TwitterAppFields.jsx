import React from 'react';
import { Card, CardBody, CardHeader, CardText } from 'reactstrap';
import { EncryptedField, TextField } from '@triniti/cms/components';

export default function TwitterAppFields() {
  return (
    <Card>
      <CardHeader>Configuration</CardHeader>
      <CardBody>
        <CardText className="pb-2">
          The app should be using <a href="https://developer.twitter.com/en/docs/authentication/oauth-1-0a" rel="noopener noreferrer" target="_blank">OAuth 1.0a</a>.
        </CardText>
        <TextField name="oauth_consumer_key" label="Oauth Consumer Key" required />
        <EncryptedField name="oauth_consumer_secret" label="Oauth Consumer Secret" required />
        <TextField name="oauth_token" label="Oauth Token" required />
        <EncryptedField name="oauth_token_secret" label="Oauth Token Secret" required />
      </CardBody>
    </Card>
  );
}
