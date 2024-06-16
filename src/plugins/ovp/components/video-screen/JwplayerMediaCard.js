import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { CheckboxField, TextField } from '@triniti/cms/components/index.js';

const JwplayerMediaCard = () =>
  <Card>
    <CardHeader>JW Player</CardHeader>
    <CardBody indent>
      <TextField label="JW Player Media ID" name="jwplayerMediaId" />
      <TextField label="JW Player Synced At" name="jwplayerSyncedAt" readOnly />
      <CheckboxField label="JW Player Sync Enabled" name="jwplayerSyncEnabled" />
    </CardBody>
  </Card>
;

export default JwplayerMediaCard;