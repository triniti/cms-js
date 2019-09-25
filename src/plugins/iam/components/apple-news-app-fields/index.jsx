import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';
import TextField from '@triniti/cms/components/text-field';
import TextAreaField from '@triniti/cms/components/textarea-field';

const AppleNewsAppFields = ({ isEditMode }) => [
  <Card key="basic">
    <CardHeader>Details</CardHeader>
    <CardBody indent>
      <Field readOnly={!isEditMode} name="title" component={TextField} label="Title" placeholder="Enter Title" />
    </CardBody>
  </Card>,
  <Card key="config">
    <CardHeader>Configuration</CardHeader>
    <CardBody indent>
      <Field readOnly={!isEditMode} name="apiKey" component={TextField} label="Api key" placeholder="Enter Api Key" />
      <Field readOnly={!isEditMode} name="apiSecret" component={TextAreaField} label="Api Secret" placeholder="Enter Api Secret" />
      <Field readOnly={!isEditMode} name="channelId" component={TextField} label="Channel Id" placeholder="Enter Channel Id" />
    </CardBody>
  </Card>,
];

AppleNewsAppFields.propTypes = {
  isEditMode: PropTypes.bool,
};

AppleNewsAppFields.defaultProps = {
  isEditMode: false,
};

export default AppleNewsAppFields;
