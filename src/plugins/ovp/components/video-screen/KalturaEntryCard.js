import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { CheckboxField, TextareaField, TextField } from '@triniti/cms/components/index.js';

const KalturaEntryCard = () => (
  <Card>
    <CardHeader>Kaltura</CardHeader>
    <CardBody indent>
      <TextField name="kalturaEntryId" label="Kaltura Entry ID" />
      <TextField name="kalturaPartnerId" label="Kaltura Partner ID" />
      <CheckboxField name="kalturaSyncEnabled" label="Kaltura Sync Enabled" />
      <TextField name="kalturaSyncedAt" label="Kaltura Synced At" readOnly />
      <TextField name="kalturaMp4Url" label="Kaltura MP4 URL" />
      <TextareaField name="kalturaMetadata" label="Kaltura Metadata" readOnly />
      <TextareaField name="kalturaFlavors" label="Kaltura Flavors" readOnly />
    </CardBody>
  </Card>
);

export default KalturaEntryCard;