import React from 'react';
import { Media } from 'reactstrap';
import AssetId from '@triniti/schemas/triniti/dam/AssetId.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import artifactUrl from '@triniti/cms/plugins/ovp/artifactUrl.js';
import { Icon } from '@triniti/cms/components/index.js';

function ArchiveAsset({ downloadUrl }) {
  return (
    <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="hover-box-shadow d-block rounded-3">
      <div className="ratio ratio-16x9 bg-body-secondary rounded-3 mb-3">
        <Icon
          imgSrc="zip"
          className="position-absolute top-50 start-50 translate-middle"
          color="dark"
          size="xxl"
          alt=""
        />
      </div>
    </a>
  );
}

function AudioAsset({ downloadUrl }) {
  return (
    <audio controls src={downloadUrl} />
  );
}

function CodeAsset({ downloadUrl }) {
  return (
    <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="hover-box-shadow d-block rounded-3">
      <div className="ratio ratio-16x9 bg-body-secondary rounded-3 mb-3">
        <Icon
          imgSrc="code"
          className="position-absolute top-50 start-50 translate-middle"
          color="dark"
          size="xxl"
          alt=""
        />
      </div>
    </a>
  );
}

function DocumentAsset({ downloadUrl }) {
  return (
    <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="hover-box-shadow d-block rounded-3">
      <div className="ratio ratio-16x9 bg-body-secondary rounded-3 mb-3">
        <Icon
          imgSrc="document"
          className="position-absolute top-50 start-50 translate-middle"
          color="dark"
          size="xxl"
          alt=""
        />
      </div>
    </a>
  );
}

function ImageAsset({ id, downloadUrl }) {
  const previewUrl = damUrl(id, '1by1', 'sm');
  return (
    <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="hover-box-shadow d-inline-block rounded-3">
      <Media src={previewUrl} alt="" width="100%" height="auto" object className="rounded-3" />
    </a>
  );
}

function UnknownAsset({ downloadUrl }) {
  return (
    <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="hover-box-shadow d-block rounded-3">
      <div className="ratio ratio-16x9 bg-body-secondary rounded-3 mb-3">
        <Icon
          imgSrc="question-outline"
          className="position-absolute top-50 start-50 translate-middle"
          color="dark"
          size="xxl"
          alt=""
        />
      </div>
    </a>
  );
}

function VideoAsset({ id }) {
  const previewUrl = id.getExt() === 'mxf' ? artifactUrl(id, 'video') : damUrl(id);
  return (
    <div className="ratio ratio-16x9">
      <video controls src={previewUrl} />
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

export default function AssetPreview({ id }) {
  const assetId = id instanceof AssetId ? id : AssetId.fromString(`${id}`);
  const downloadUrl = damUrl(assetId);
  const Component = components[assetId.getType()] || components['unknown'];
  return <Component id={assetId} downloadUrl={downloadUrl} />;
}
