import React from 'react';
import { Alert } from 'reactstrap';
import capitalize from 'lodash-es/capitalize.js';
import TranscodingStatus from '@triniti/schemas/triniti/ovp/enums/TranscodingStatus.js';
import TranscriptionStatus from '@triniti/schemas/triniti/ovp/enums/TranscriptionStatus.js';

export default function ProcessingErrorAlert({ node }) {
  const transcodingStatus = node.get('transcoding_status', TranscodingStatus.UNKNOWN);
  const transcriptionStatus = node.get('transcription_status', TranscriptionStatus.UNKNOWN);

  const transcodingFailed = transcodingStatus === TranscodingStatus.FAILED || 
                          transcodingStatus === TranscodingStatus.CANCELED;

  const transcriptionFailed = transcriptionStatus === TranscriptionStatus.FAILED || 
                            transcriptionStatus === TranscriptionStatus.CANCELED;

  if (!transcodingFailed && !transcriptionFailed) {
    return null;
  }

  return (
    <>
      {transcodingFailed && (
        <Alert color="danger" className="my-3">
          <strong>Transcoding Status: {capitalize(`${transcodingStatus}`)}</strong>
        </Alert>
      )}
      {transcriptionFailed && (
        <Alert color="danger" className="my-3">
          <strong>Transcription Status: {capitalize(`${transcriptionStatus}`)}</strong>
        </Alert>
      )}
    </>
  );
}
