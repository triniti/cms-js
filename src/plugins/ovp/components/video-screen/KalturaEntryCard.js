import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { CheckboxField, TextareaField, TextField } from '@triniti/cms/components/index.js';

const KalturaEntryCard = () => (
  <Card>
    <CardHeader>Kaltura</CardHeader>
    <CardBody indent>
      <TextField name="kaltura_entry_id" label="Kaltura Entry ID" />
      <TextField name="kaltura_partner_id" label="Kaltura Partner ID" />
      <CheckboxField name="kaltura_sync_enabled" label="Kaltura Sync Enabled" />
      <TextField name="kaltura_synced_at" label="Kaltura Synced At" readOnly />
      <TextField name="kaltura_mp4_url" label="Kaltura MP4 URL" />
      <TextareaField name="kaltura_metadata" label="Kaltura Metadata" readOnly />
      <TextareaField name="kaltura_flavors" label="Kaltura Flavors" readOnly />
    </CardBody>
  </Card>
);

export default KalturaEntryCard;