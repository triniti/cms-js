import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import TextField from '@triniti/cms/components/text-field';
import delegate from './delegate';

const MedialiveChannelFields = ({ handleGetMedialiveChannelStatus, isEditMode }) => {
  useEffect(() => {
    handleGetMedialiveChannelStatus();
  }, []);
  return (
    <Card>
      <CardHeader>Medialive</CardHeader>
      <CardBody indent>
        <Field name="medialiveChannelArn" component={TextField} label="Medialive Channel ARN" placeholder="enter medialive channel arn" readOnly={!isEditMode} />
      </CardBody>
    </Card>
  );
};

MedialiveChannelFields.propTypes = {
  handleGetMedialiveChannelStatus: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
};

MedialiveChannelFields.defaultProps = {
  isEditMode: true,
};

export default connect(null, delegate)(MedialiveChannelFields);
