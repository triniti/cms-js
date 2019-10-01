import React from 'react';
import { Field } from 'redux-form';
import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';
import TextField from '@triniti/cms/components/text-field';
import TextareaField from '@triniti/cms/components/textarea-field';
import CheckboxField from '@triniti/cms/components/checkbox-field';
import PropTypes from 'prop-types';

const KalturaEntryFields = ({ isEditMode }) => (
  <Card>
    <CardHeader>Kaltura</CardHeader>
    <CardBody indent>
      <Field name="kalturaEntryId" component={TextField} label="Kaltura Entry ID" placeholder="enter kaltura entry id" readOnly={!isEditMode} />
      <Field name="kalturaPartnerId" component={TextField} label="Kaltura Partner ID" placeholder="enter kaltura partner id" readOnly={!isEditMode} />
      <Field name="kalturaSyncEnabled" component={CheckboxField} label="Kaltura Sync Enabled" disabled={!isEditMode} />
      <Field name="kalturaSyncedAt" component={TextField} label="Kaltura Synced At" placeholder="kaltura synced at" readOnly />
      <Field name="kalturaMp4Url" component={TextField} label="Kaltura MP4 URL" placeholder="kaltura mp4 url" readOnly={!isEditMode} />
      <Field name="kalturaMetadata" component={TextareaField} label="Kaltura Metadata" placeholder="kaltura metadata" readOnly />
      <Field name="kalturaFlavors" component={TextareaField} label="Kaltura Flavors" placeholder="kaltura flavors" readOnly />
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
