import React from 'react';
import Archive from '@triniti/cms/plugins/dam/components/asset-snippet/Archive.js';
import Audio from '@triniti/cms/plugins/dam/components/asset-snippet/Audio.js';
import Code from '@triniti/cms/plugins/dam/components/asset-snippet/Code.js';
import Document from '@triniti/cms/plugins/dam/components/asset-snippet/Document.js';
import Image from '@triniti/cms/plugins/dam/components/asset-snippet/Image.js';
import Unknown from '@triniti/cms/plugins/dam/components/asset-snippet/Unknown.js';
import Video from '@triniti/cms/plugins/dam/components/asset-snippet/Video.js';

const AssetSnippet = ({ asset, previewUrl }) => {
  switch (asset.get('_id').getType()) {
    case 'archive':
      return <Archive asset={asset} />;
    case 'audio':
      return <Audio asset={asset} />;
    case 'code':
      return <Code asset={asset} />;
    case 'document':
      return <Document asset={asset} />;
    case 'image':
      return <Image asset={asset} previewUrl={previewUrl} />;
    case 'video':
      return <Video asset={asset} />;
    case 'unknown':
    default:
      return <Unknown asset={asset} />;
  }
};

export default AssetSnippet;
