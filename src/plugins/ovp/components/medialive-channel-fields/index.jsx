import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import TextField from '@triniti/cms/components/text-field';
import delegate from './delegate';

const MediaLiveChannelFields = ({ handleGetMediaLiveChannelStatus, isEditMode }) => {
  useEffect(() => {
    handleGetMediaLiveChannelStatus();
  }, []);
  return (
    <Card>
      <CardHeader>MediaLive</CardHeader>
      <CardBody indent>
        <Field name="medialiveChannelArn" component={TextField} label="MediaLive Channel ARN" placeholder="enter medialive channel arn" readOnly={!isEditMode} />
      </CardBody>
    </Card>
  );
};

MediaLiveChannelFields.propTypes = {
  handleGetMediaLiveChannelStatus: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
};

MediaLiveChannelFields.defaultProps = {
  isEditMode: true,
};

export default connect(null, delegate)(MediaLiveChannelFields);
