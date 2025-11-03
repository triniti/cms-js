import React from 'react';
import AssetCardGrid from '@triniti/cms/plugins/dam/components/asset-picker-field/AssetCardGrid.js';
import ImageGrid from '@triniti/cms/plugins/dam/components/asset-picker-field/ImageGrid.js';
import AssetTable from '@triniti/cms/plugins/dam/components/linked-assets-card/AssetTable.js';

export default function AssetViewer({ displayView, nodes = [], type, ...props }) {
  let Component;

  if (displayView === 'asset-card-grid') {
    Component = AssetCardGrid;
  } else {
    Component = type === 'image-asset' ? ImageGrid : AssetTable;
  }

  return <Component nodes={nodes} {...props} />;
}
