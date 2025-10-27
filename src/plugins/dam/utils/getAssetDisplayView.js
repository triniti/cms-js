import AssetTable from '@triniti/cms/plugins/dam/components/linked-assets-card/AssetTable.js';
import ImageGrid from '@triniti/cms/plugins/dam/components/asset-picker-field/ImageGrid.js';
import AssetCardGrid from '@triniti/cms/plugins/dam/components/asset-picker-field/AssetCardGrid.js';

export default function getAssetDisplayView(displayView, nodes = [], type) {
  if (displayView === 'asset-grid') {
    return AssetCardGrid;
  }

  if (displayView === 'table') {
    return AssetTable;
  }

  if (displayView === 'image-grid') {
    const allImages = nodes.length > 0 && nodes.every(n => `${n.get('mime_type', '')}`.startsWith('image/'));
    return allImages ? ImageGrid : AssetTable;
  }

  return type === 'image-asset' ? ImageGrid : AssetTable;
}
