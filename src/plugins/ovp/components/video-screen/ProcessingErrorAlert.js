import React from 'react';
import { Alert } from 'reactstrap';
import capitalize from 'lodash-es/capitalize.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import TranscodingStatus from '@triniti/schemas/triniti/ovp/enums/TranscodingStatus.js';
import TranscriptionStatus from '@triniti/schemas/triniti/ovp/enums/TranscriptionStatus.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';

function ProcessingErrorAlert({ nodeRef, request }) {
  request.set('linked_ref', NodeRef.fromString(`${nodeRef}`));
  request.clear('types').addToSet('types', ['video-asset']);
  request.set('count', 10);

  const { response } = useRequest(request);

  if (!response || !response.has('nodes')) {
    return null;
  }

  const failedAssets = response.get('nodes', []).filter(asset => {
    const transcodingStatus = asset.get('transcoding_status', TranscodingStatus.UNKNOWN);
    const transcriptionStatus = asset.get('transcription_status', TranscriptionStatus.UNKNOWN);
    
    return transcodingStatus === TranscodingStatus.FAILED || 
           transcodingStatus === TranscodingStatus.CANCELED ||
           transcriptionStatus === TranscriptionStatus.FAILED || 
           transcriptionStatus === TranscriptionStatus.CANCELED;
  });

  if (failedAssets.length === 0) {
    return null;
  }

  const asset = failedAssets[0];
  const transcodingStatus = asset.get('transcoding_status', TranscodingStatus.UNKNOWN);
  const transcriptionStatus = asset.get('transcription_status', TranscriptionStatus.UNKNOWN);

  const transcodingFailed = transcodingStatus === TranscodingStatus.FAILED || 
                           transcodingStatus === TranscodingStatus.CANCELED;
  const transcriptionFailed = transcriptionStatus === TranscriptionStatus.FAILED || 
                             transcriptionStatus === TranscriptionStatus.CANCELED;

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

export default withRequest(ProcessingErrorAlert, 'triniti:dam:request:search-assets-request:v1', {
  channel: 'web',
  count: 10,
  sort: 'created-at-desc',
});
