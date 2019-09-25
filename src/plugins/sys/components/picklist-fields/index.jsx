import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';
import TextField from '@triniti/cms/components/text-field';
import CheckboxField from '@triniti/cms/components/checkbox-field';
import Options from './Options';

const PicklistFields = ({ isEditMode }) => (
  <Card>
    <CardHeader>Details</CardHeader>
    <CardBody indent>
      <Field
        name="title"
        component={TextField}
        label="Picklist Title"
        placeholder="Picklist Title"
        readOnly
      />
      <Field name="alphaSort" component={CheckboxField} disabled={!isEditMode} label="Sort Alphabetically" />
      <Field name="allowOther" component={CheckboxField} disabled={!isEditMode} label="Allow Other" />
      <FieldArray name="options" label="Options" component={Options} isEditMode={isEditMode} />
    </CardBody>
  </Card>
);

PicklistFields.propTypes = {
  isEditMode: PropTypes.bool,
};

PicklistFields.defaultProps = {
  isEditMode: false,
};

export default PicklistFields;
