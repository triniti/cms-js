import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';
import { Field } from 'redux-form';
import React from 'react';
import TextField from '@triniti/cms/components/text-field';

const JwplayerMediaFields = () => (
  <Card>
    <CardHeader>JW Player</CardHeader>
    <CardBody indent>
      <Field
        component={TextField}
        label="JW Player Media ID"
        name="jwplayerMediaId"
        readOnly
      />
    </CardBody>
  </Card>
);

export default JwplayerMediaFields;
