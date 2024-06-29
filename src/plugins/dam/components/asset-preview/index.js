import React from 'react';
import { Media } from 'reactstrap';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import { Icon } from '@triniti/cms/components/index.js';

function ArchiveAsset({ asset, downloadUrl }) {
  return (
    <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="hover-box-shadow d-block rounded-3">
      <div className="ratio ratio-16x9 bg-body-secondary rounded-3 mb-3">
        <Icon imgSrc="zip" alt="" className="position-absolute top-50 start-50 translate-middle" color="dark" size="xxl" />
      </div>
    </a>
  );
}

function AudioAsset({ asset, downloadUrl }) {
  return (
    <audio controls src={downloadUrl} />
  );
}

function CodeAsset({ asset, downloadUrl }) {
  return (
    <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="hover-box-shadow d-block rounded-3">
      <div className="ratio ratio-16x9 bg-body-secondary rounded-3 mb-3">
        <Icon imgSrc="code" alt="" className="position-absolute top-50 start-50 translate-middle" color="dark" size="xxl" />
      </div>
    </a>
  );
}

function DocumentAsset({ asset, downloadUrl }) {
  return (
    <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="hover-box-shadow d-block rounded-3">
      <div className="ratio ratio-16x9 bg-body-secondary rounded-3 mb-3">
        <Icon imgSrc="document" alt="" className="position-absolute top-50 start-50 translate-middle" color="dark" size="xxl" />
      </div>
    </a>
  );
}

function ImageAsset({ asset, downloadUrl }) {
  const previewUrl = damUrl(asset, '1by1', 'md');
  return (
    <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="hover-box-shadow d-block rounded-3">
      <Media src={previewUrl} alt="" width="100%" height="auto" object className="rounded-3" />
    </a>
  );
}

function UnknownAsset({ asset, downloadUrl }) {
  return (
    <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="hover-box-shadow d-block rounded-3">
      <div className="ratio ratio-16x9 bg-body-secondary rounded-3 mb-3">
        <Icon imgSrc="question-outline" alt="" className="position-absolute top-50 start-50 translate-middle" color="dark" size="xxl" />
      </div>
    </a>
  );
}

function VideoAsset({ asset, downloadUrl }) {
  return (
    <video className="ratio ratio-16x9" controls src={downloadUrl} />
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

export default function AssetPreview({ asset }) {
  const downloadUrl = damUrl(asset);
  const Component = components[asset.schema().getCurie().getMessage()] || components['unknown-asset'];
  return <Component asset={asset} downloadUrl={downloadUrl} />;
}
