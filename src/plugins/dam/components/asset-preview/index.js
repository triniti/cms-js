import React from 'react';
import { Button, Media } from 'reactstrap';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import { Icon } from '@triniti/cms/components/index.js';

function ArchiveAsset({ node, downloadUrl }) {
  return (
    <Button color="hover">
      <Icon imgSrc="zip" alt="" />
    </Button>
  );
}

function AudioAsset({ node, downloadUrl }) {
  return (
    <audio controls src={downloadUrl} />
  );
}

function CodeAsset({ node, downloadUrl }) {
  return (
    <Button color="hover">
      <Icon imgSrc="code" alt="" />
    </Button>
  );
}

function DocumentAsset({ node, downloadUrl }) {
  return (
    <Button color="hover">
      <Icon imgSrc="document" alt="" />
    </Button>
  );
}

function ImageAsset({ node, downloadUrl }) {
  const previewUrl = damUrl(node, '1by1', 'md');
  return (
    <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
      <Media src={previewUrl} alt="" width="100%" height="auto" object className="rounded-2" />
    </a>
  );
}

function UnknownAsset({ node, downloadUrl }) {
  return (
    <Button color="hover">
      <Icon imgSrc="question-outline" alt="" />
    </Button>
  );
}

function VideoAsset({ node, downloadUrl }) {
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

export default function AssetPreview({ node }) {
  const downloadUrl = damUrl(node);
  const Component = components[node.schema().getCurie().getMessage()] || components['unknown-asset'];
  return <Component node={node} downloadUrl={downloadUrl} />;
}
