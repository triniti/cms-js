import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { CheckboxField, TextareaField, TextField } from '@triniti/cms/components/index.js';
import PropTypes from 'prop-types';

const KalturaEntryFields = () => (
  <Card>
    <CardHeader>Kaltura</CardHeader>
    <CardBody indent>
      <TextField name="kalturaEntryId" label="Kaltura Entry ID" placeholder="enter kaltura entry id" />
      <TextField name="kalturaPartnerId" label="Kaltura Partner ID" placeholder="enter kaltura partner id" />
      <CheckboxField name="kalturaSyncEnabled" label="Kaltura Sync Enabled" />
      <TextField name="kalturaSyncedAt" label="Kaltura Synced At" placeholder="kaltura synced at" readOnly />
      <TextField name="kalturaMp4Url" label="Kaltura MP4 URL" placeholder="kaltura mp4 url" />
      <TextareaField name="kalturaMetadata" label="Kaltura Metadata" placeholder="kaltura metadata" readOnly />
      <TextareaField name="kalturaFlavors" label="Kaltura Flavors" placeholder="kaltura flavors" readOnly />
    </CardBody>
  </Card>
);

KalturaEntryFields.propTypes = {
  isEditMode: PropTypes.bool,
};

KalturaEntryFields.defaultProps = {
  isEditMode: true,
};

export default KalturaEntryFields;