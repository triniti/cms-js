import React from 'react';
import { Card, CardHeader } from 'reactstrap';
import useNode from '@triniti/cms/plugins/ncr/components/useNode.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import artifactUrl from '@triniti/cms/plugins/ovp/artifactUrl.js';

function VideoAsset({ id }) {
  const previewUrl = id.getExt() === 'mxf' ? artifactUrl(id, 'video') : damUrl(id);
  return (
    <div className="ratio ratio-16x9">
      <video controls src={previewUrl} />
    </div>
  );
}

export default function VideoPreviewCard(props) {
  const { nodeRef } = props;
  const { node } = useNode(nodeRef);

  if (!node) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <span>
          Preview
        </span>
      </CardHeader>

      <VideoAsset id={node.get('_id')} />
    </Card>
  );
}
