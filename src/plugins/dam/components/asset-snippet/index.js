import React from 'react';
import Archive from './Archive';
import Audio from './Audio';
import Code from './Code';
import Document from './Document';
import Image from './Image';
import Unknown from './Unknown';
import Video from './Video';

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
