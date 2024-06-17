import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { CheckboxField, TextField } from '@triniti/cms/components/index.js';

export default JwplayerMediaCard = () =>
  <Card>
    <CardHeader>JW Player</CardHeader>
    <CardBody indent>
      <TextField label="JW Player Media ID" name="jwplayer_media_id" />
      <TextField label="JW Player Synced At" name="jwplayer_synced_at" readOnly />
      <CheckboxField label="JW Player Sync Enabled" name="jwplayer_sync_enabled" />
    </CardBody>
  </Card>
;