import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import AssetPreview from '@triniti/cms/plugins/dam/components/asset-preview/index.js';

export default function MezzaninePreviewCard(props) {
  const { nodeRef } = props;

  return (
    <Card className="border-top border-dark-subtle">
      <CardHeader>Preview</CardHeader>
      <CardBody className="p-0">
        <AssetPreview id={nodeRef.getId()} />
      </CardBody>
    </Card>
  );
}
