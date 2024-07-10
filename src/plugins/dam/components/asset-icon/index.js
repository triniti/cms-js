import React from 'react';
import { Media } from 'reactstrap';
import AssetId from '@triniti/schemas/triniti/dam/AssetId.js';
import artifactUrl from '@triniti/cms/plugins/ovp/artifactUrl.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import { Icon } from '@triniti/cms/components/index.js';

function ArchiveAsset() {
  return (
    <div className="ratio ratio-1x1 bg-body-secondary rounded-2">
      <Icon imgSrc="zip" alt="" className="position-absolute top-50 start-50 translate-middle" color="dark" size="lg" />
    </div>
  );
}

function CodeAsset() {
  return (
    <div className="ratio ratio-1x1 bg-body-secondary rounded-2">
      <Icon imgSrc="code" alt="" className="position-absolute top-50 start-50 translate-middle" color="dark" size="lg" />
    </div>
  );
}

function AudioAsset() {
  return (
    <div className="ratio ratio-1x1 bg-body-secondary rounded-2">
      <Icon imgSrc="audio" alt="" className="position-absolute top-50 start-50 translate-middle" color="dark" size="lg" />
    </div>
  );
}

function DocumentAsset() {
  return (
    <div className="ratio ratio-1x1 bg-body-secondary rounded-2">
      <Icon imgSrc="document" alt="" className="position-absolute top-50 start-50 translate-middle" color="dark" size="lg" />
    </div>
  );
}

function ImageAsset({ id }) {
  return (
    <Media
      src={damUrl(id, '1by1', 'xs')}
      alt=""
      width="44"
      height="44"
      object
      className="rounded-2"
    />
  );
}

function UnknownAsset() {
  return (
    <div className="ratio ratio-1x1 bg-body-secondary rounded-2">
      <Icon imgSrc="question-outline" alt="" className="position-absolute top-50 start-50 translate-middle" color="dark" size="lg" />
    </div>
  );
}

function VideoAsset() {
  return (
    <div className="ratio ratio-1x1 bg-body-secondary rounded-2">
      <Icon imgSrc="video" alt="" className="position-absolute top-50 start-50 translate-middle" color="dark" size="lg" />
    </div>
  );
}

const components = {
  'archive': ArchiveAsset,
  'audio': AudioAsset,
  'code': CodeAsset,
  'document': DocumentAsset,
  'image': ImageAsset,
  'unknown': UnknownAsset,
  'video': VideoAsset,
};

export default function AssetIcon({ id }) {
  const assetId = id instanceof AssetId ? id : AssetId.fromString(`${id}`);
  const downloadUrl = assetId.getType() === 'video' ? artifactUrl(assetId, 'video') : damUrl(assetId);
  const Component = components[assetId.getType()] || components['unknown'];

  return (
    <a
      href={downloadUrl}
      target="_blank"
      className="hover-box-shadow d-block rounded-2"
      style={{ minWidth: '44px' }}
      rel="noopener noreferrer"
    >
      <Component id={assetId} />
    </a>
  );
}
