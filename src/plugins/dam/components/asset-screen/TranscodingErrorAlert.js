import React from 'react';
import { Alert } from 'reactstrap';
import capitalize from 'lodash-es/capitalize.js';
import TranscodingStatus from '@triniti/schemas/triniti/ovp/enums/TranscodingStatus.js';

function TranscodingErrorAlert(props) {
  const { node } = props;
  const status = node.get('transcoding_status', TranscodingStatus.UNKNOWN);

  if (status !== TranscodingStatus.FAILED && status !== TranscodingStatus.CANCELED) {
    return null;
  }

  return (
    <Alert color="danger" className="my-3">
      <strong>Transcoding Status: {capitalize(status)}</strong>
    </Alert>
  );
}

export default TranscodingErrorAlert;
