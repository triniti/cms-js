import React from 'react';
import { Media } from 'reactstrap';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import { Icon } from '@triniti/cms/components/index.js';

function ArchiveAsset({ asset }) {
  return (
    <div className="ratio ratio-1x1 bg-body-secondary rounded-2">
      <Icon imgSrc="zip" alt="" className="position-absolute top-50 start-50 translate-middle" color="dark" size="lg" />
    </div>
  );
}

function CodeAsset({ asset }) {
  return (
    <div className="ratio ratio-1x1 bg-body-secondary rounded-2">
      <Icon imgSrc="code" alt="" className="position-absolute top-50 start-50 translate-middle" color="dark" size="lg" />
    </div>
  );
}

function AudioAsset({ asset }) {
  return (
    <div className="ratio ratio-1x1 bg-body-secondary rounded-2">
      <Icon imgSrc="audio" alt="" className="position-absolute top-50 start-50 translate-middle" color="dark" size="lg" />
    </div>
  );
}

function DocumentAsset({ asset }) {
  return (
    <div className="ratio ratio-1x1 bg-body-secondary rounded-2">
      <Icon imgSrc="document" alt="" className="position-absolute top-50 start-50 translate-middle" color="dark" size="lg" />
    </div>
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
    <div className="ratio ratio-1x1 bg-body-secondary rounded-2">
      <Icon imgSrc="question-outline" alt="" className="position-absolute top-50 start-50 translate-middle" color="dark" size="lg" />
    </div>
  );
}

function VideoAsset({ asset }) {
  return (
    <div className="ratio ratio-1x1 bg-body-secondary rounded-2">
      <Icon imgSrc="video" alt="" className="position-absolute top-50 start-50 translate-middle" color="dark" size="lg" />
    </div>
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
    <a
      href={downloadUrl}
      target="_blank"
      className="hover-box-shadow d-block rounded-2"
      style={{ minWidth: '44px' }}
      rel="noopener noreferrer"
      title={`Download ${asset.get('title')}`}
    >
      <Component asset={asset} />
    </a>
  );
}
