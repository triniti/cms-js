import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';
import TextField from '@triniti/cms/components/text-field';

const SmsAppFields = ({ isEditMode }) => (
  <Card>
    <CardHeader>Details</CardHeader>
    <CardBody indent>
      <Field readOnly={!isEditMode} name="title" component={TextField} label="Title" placeholder="Enter Title" />
    </CardBody>
  </Card>
);

SmsAppFields.propTypes = {
  isEditMode: PropTypes.bool,
};

SmsAppFields.defaultProps = {
  isEditMode: false,
};

export default SmsAppFields;
