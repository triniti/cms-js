import React from 'react';
import { Alert } from 'reactstrap';
import TranscodingStatus from '@triniti/schemas/triniti/ovp/enums/TranscodingStatus.js';

function TranscodingErrorAlert(props) {
  const { node } = props;
  const status = node.get('transcoding_status', TranscodingStatus.UNKNOWN);

  if (status !== TranscodingStatus.FAILED && status !== TranscodingStatus.CANCELED) {
    return null;
  }

  return (
    <Alert color="danger" className="mb-3">
      <strong>TRANSCODING STATUS: {status.getValue().toUpperCase()}</strong>
    </Alert>
  );
}

export default TranscodingErrorAlert;
