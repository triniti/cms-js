import React from 'react';
import { Card, CardBody, CardHeader, CardText } from 'reactstrap';
import { EncryptedField, TextField } from '@triniti/cms/components/index.js';

export default function FirebaseFields() {
  return (
    <Card>
      <CardHeader>Firebase Configuration</CardHeader>
      <CardBody>
        <CardText className="pb-2">
          These values can be found in the <a href="plugins/iam/components/app-screen/FirebaseFields" rel="noopener noreferrer" target="_blank">Firebase console</a> Settings pane of a project.
        </CardText>
        <TextField name="fcm_project_id" label="Project ID" />
        <TextField
          name="fcm_sender_id"
          label="Sender ID"
          description={<>
            A unique numerical value, available in the <strong>Cloud Messaging</strong> tab of the Firebase console Settings pane.
          </>}
        />
        <EncryptedField
          name="fcm_api_key"
          label="Server Key"
          description={<>
            Available in the <strong>Cloud Messaging</strong> tab of the Firebase console Settings pane.
          </>}
        />
        <TextField name="fcm_web_api_key" label="Web API Key" />
      </CardBody>
    </Card>
  );
}
