import React from 'react';
import { Alert } from 'reactstrap';
import capitalize from 'lodash-es/capitalize.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import TranscodingStatus from '@triniti/schemas/triniti/ovp/enums/TranscodingStatus.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';

function TranscodingErrorAlert(props) {
  const { nodeRef, request } = props;

  // Search for video assets linked to this video
  request.set('linked_ref', NodeRef.fromString(`${nodeRef}`));
  request.clear('types').addToSet('types', ['video-asset']);
  request.set('count', 10);

  const { response } = useRequest(request);

  if (!response || !response.has('nodes')) {
    return null;
  }

  // Find assets with failed transcoding
  const failedAssets = response.get('nodes', []).filter(asset => {
    const status = asset.get('transcoding_status', TranscodingStatus.UNKNOWN);
    return status === TranscodingStatus.FAILED || status === TranscodingStatus.CANCELED;
  });

  if (failedAssets.length === 0) {
    return null;
  }

  // Get the first failed asset for display
  const asset = failedAssets[0];
  const status = asset.get('transcoding_status');

  return (
    <Alert color="danger" className="my-3">
      <strong>Transcoding Status: {capitalize(status)}</strong>
    </Alert>
  );
}

export default withRequest(TranscodingErrorAlert, 'triniti:dam:request:search-assets-request:v1', {
  channel: 'web',
  count: 10,
  sort: 'created-at-desc',
});
