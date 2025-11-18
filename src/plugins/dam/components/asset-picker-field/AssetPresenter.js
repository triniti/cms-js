import React from 'react';
import AssetCardGrid from '@triniti/cms/plugins/dam/components/asset-picker-field/AssetCardGrid.js';
import AssetTableLinked from '@triniti/cms/plugins/dam/components/linked-assets-card/AssetTable.js';
import AssetTablePicker from '@triniti/cms/plugins/dam/components/asset-picker-field/AssetTable.js';
import ImageGrid from '@triniti/cms/plugins/dam/components/asset-picker-field/ImageGrid.js';


export default function AssetPresenter({ displayView, nodes = [], type, batch, ...props }) {
  let Component;

  if (displayView === 'asset-card-grid') {
    Component = AssetCardGrid;
  } else if (type === 'image-asset') {
    Component = ImageGrid;
  } else {
    // Use linked-assets-card AssetTable when batch is provided, otherwise use picker AssetTable
    Component = batch ? AssetTableLinked : AssetTablePicker;
  }

  return <Component nodes={nodes} batch={batch} {...props} />;
}
