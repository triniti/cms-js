import React from 'react';
import { Button, Media } from 'reactstrap';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import { Icon } from '@triniti/cms/components/index.js';

function ArchiveAsset({ asset }) {
  return (
    <Button color="hover" tabIndex="-1">
      <Icon imgSrc="zip" alt="" />
    </Button>
  );
}

function CodeAsset({ asset }) {
  return (
    <Button color="hover" tabIndex="-1">
      <Icon imgSrc="code" alt="" />
    </Button>
  );
}

function AudioAsset({ asset }) {
  return (
    <Button color="hover" tabIndex="-1">
      <Icon imgSrc="audio" alt="" />
    </Button>
  );
}

function DocumentAsset({ asset }) {
  return (
    <Button color="hover" tabIndex="-1">
      <Icon imgSrc="document" alt="" />
    </Button>
  );
}

function ImageAsset({ asset }) {
  return (
    <Media
      src={damUrl(asset, '1by1', 'xs')}
      alt=""
      width="44"
      height="44"
      object
      className="rounded-2"
    />
  );
}

function UnknownAsset({ asset }) {
  return (
    <Button color="hover" tabIndex="-1">
      <Icon imgSrc="question-outline" alt="" />
    </Button>
  );
}

function VideoAsset({ asset }) {
  return (
    <Button color="hover" tabIndex="-1">
      <Icon imgSrc="video" alt="" />
    </Button>
  );
}

const components = {
  'archive-asset': ArchiveAsset,
  'audio-asset': AudioAsset,
  'code-asset': CodeAsset,
  'document-asset': DocumentAsset,
  'image-asset': ImageAsset,
  'unknown-asset': UnknownAsset,
  'video-asset': VideoAsset,
};

export default function AssetIcon({ asset }) {
  const downloadUrl = damUrl(asset);
  const Component = components[asset.schema().getCurie().getMessage()] || components['unknown-asset'];

  return (
    <a href={downloadUrl} target="_blank" rel="noopener noreferrer" title={`Download ${asset.get('title')}`}>
      <Component asset={asset} />
    </a>
  );
}
