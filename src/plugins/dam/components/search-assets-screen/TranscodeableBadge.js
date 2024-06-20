import React from 'react';
import { Badge } from 'reactstrap';
import withPbj from '@triniti/cms/components/with-pbj/index.js';

function TranscodeableBadge({ asset }) {
  const status = asset.has('transcoding_status') ? asset.get('transcoding_status').getValue() : 'unknown';
  let bgColor = 'secondary';
  if (status === 'completed') {
    bgColor = 'success';
  } else if (status === 'failed') {
    bgColor = 'danger';
  }
  return <Badge color={bgColor} pill className={`ms-2 status-${status}`}>{status}</Badge>;
}

export default withPbj(TranscodeableBadge, '*:dam:node:image-asset:v1');
