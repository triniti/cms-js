import React from 'react';
import { Media } from 'reactstrap';
import AssetId from '@triniti/schemas/triniti/dam/AssetId.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import { Icon } from '@triniti/cms/components/index.js';

function ArchiveAsset() {
  return (
    <div className="ratio ratio-1x1 bg-body-secondary rounded-2">
      <Icon
        imgSrc="zip"
        className="position-absolute top-50 start-50 translate-middle"
        color="dark"
        size="lg"
        alt=""
      />
    </div>
  );
}

function CodeAsset() {
  return (
    <div className="ratio ratio-1x1 bg-body-secondary rounded-2">
      <Icon
        imgSrc="code"
        className="position-absolute top-50 start-50 translate-middle"
        color="dark"
        size="lg"
        alt=""
      />
    </div>
  );
}

function AudioAsset() {
  return (
    <div className="ratio ratio-1x1 bg-body-secondary rounded-2">
      <Icon
        imgSrc="audio"
        className="position-absolute top-50 start-50 translate-middle"
        color="dark"
        size="lg"
        alt=""
      />
    </div>
  );
}

function DocumentAsset() {
  return (
    <div className="ratio ratio-1x1 bg-body-secondary rounded-2">
      <Icon
        imgSrc="document"
        className="position-absolute top-50 start-50 translate-middle"
        color="dark"
        size="lg"
        alt=""
      />
    </div>
  );
}

function ImageAsset({ id }) {
  return (
    <Media
      src={damUrl(id, '1by1', 'xs')}
      className="rounded-2"
      width="44"
      height="44"
      object
      alt=""
    />
  );
}

function UnknownAsset() {
  return (
    <div className="ratio ratio-1x1 bg-body-secondary rounded-2">
      <Icon
        imgSrc="question-outline"
        className="position-absolute top-50 start-50 translate-middle"
        color="dark"
        size="lg"
        alt=""
      />
    </div>
  );
}

function VideoAsset() {
  return (
    <div className="ratio ratio-1x1 bg-body-secondary rounded-2">
      <Icon
        imgSrc="video"
        className="position-absolute top-50 start-50 translate-middle"
        color="dark"
        size="lg"
        alt=""
      />
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
  const downloadUrl = damUrl(assetId);
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
