import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@triniti/cms/components/text-field';

const MediaLiveChannelFields = ({ isEditMode }) => (
  <Card>
    <CardHeader>Livestream</CardHeader>
    <CardBody indent>
      <Field name="medialiveChannelArn" component={TextField} label="MediaLive Channel ARN" placeholder="enter medialive channel arn" readOnly={!isEditMode} />
    </CardBody>
  </Card>
);

MediaLiveChannelFields.propTypes = {
  isEditMode: PropTypes.bool,
};

MediaLiveChannelFields.defaultProps = {
  isEditMode: true,
};

export default MediaLiveChannelFields;
