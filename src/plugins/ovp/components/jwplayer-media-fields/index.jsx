import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';
import { Field } from 'redux-form';
import CheckboxField from '@triniti/cms/components/checkbox-field';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@triniti/cms/components/text-field';

const JwplayerMediaFields = ({ isEditMode }) => (
  <Card>
    <CardHeader>JW Player</CardHeader>
    <CardBody indent>
      <Field
        component={TextField}
        label="JW Player Media ID"
        name="jwplayerMediaId"
        placeholder="enter jw player media id..."
        readOnly={isEditMode}
      />
      <Field
        component={TextField}
        label="JW Player Synced At"
        name="jwplayerSyncedAt"
        readOnly
      />
      <Field
        component={CheckboxField}
        disabled={!isEditMode}
        label="JW Player Sync Enabled"
        name="jwplayerSyncEnabled"
      />
    </CardBody>
  </Card>
);

JwplayerMediaFields.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
};

export default JwplayerMediaFields;
