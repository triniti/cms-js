import React from 'react';
import { Card, CardHeader } from 'reactstrap';
import AssetPreview from '@triniti/cms/plugins/dam/components/asset-preview/index.js';

export default ({ nodeRef }) => (
  <Card>
    <CardHeader>Preview</CardHeader>
    <AssetPreview id={nodeRef.getId()} />
  </Card>
);
