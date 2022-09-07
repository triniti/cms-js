import React from 'react';
import artifactUrl from 'plugins/ovp/artifactUrl';
import ReactPlayer from 'react-player';


export default function VideoAssetFields({asset}) {
  return (
    <ReactPlayer url={artifactUrl(asset, 'video')} width="100%" height="auto" controls />
  );
}
