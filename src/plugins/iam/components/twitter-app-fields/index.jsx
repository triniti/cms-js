import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';
import TextField from '@triniti/cms/components/text-field';
import TextAreaField from '@triniti/cms/components/textarea-field';

const TwitterAppFields = ({ isEditMode }) => [
  <Card key="basic">
    <CardHeader>Details</CardHeader>
    <CardBody indent>
      <Field readOnly={!isEditMode} name="title" component={TextField} label="Title" placeholder="Enter Title" />
    </CardBody>
  </Card>,
  <Card key="config">
    <CardHeader>Configuration</CardHeader>
    <CardBody indent>
      <Field readOnly={!isEditMode} name="oauthConsumerKey" component={TextField} label="Oauth Consumer Key" placeholder="Enter Oauth Consumer Key" />
      <Field readOnly={!isEditMode} name="oauthConsumerSecret" component={TextAreaField} label="Oauth Consumer Secret" placeholder="Enter Oauth Consumer Secret" />
      <Field readOnly={!isEditMode} name="oauthToken" component={TextField} label="Oauth Token" placeholder="Enter Oauth Token" />
      <Field readOnly={!isEditMode} name="oauthTokenSecret" component={TextAreaField} label="Oauth Token Secret" placeholder="Enter Oauth Token Secret" />
    </CardBody>
  </Card>,
];

TwitterAppFields.propTypes = {
  isEditMode: PropTypes.bool,
};

TwitterAppFields.defaultProps = {
  isEditMode: false,
};

export default TwitterAppFields;
