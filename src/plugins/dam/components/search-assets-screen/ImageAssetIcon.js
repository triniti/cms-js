import React from 'react';
import { Media } from 'reactstrap';
import damUrl from 'plugins/dam/damUrl';

export default function ImageAssetIcon({asset}) {

  const previewUrl = damUrl(asset);

  return (
    <>
    {previewUrl && (
      <a href={previewUrl} target="_blank" rel="noopener noreferrer">
      <Media
        src={damUrl(asset, '1by1', 'xs', null)}
        alt=""
        width="32"
        height="32"
        object
        className="rounded-2"
      />
      </a>
    )}
    </>
  );
}
