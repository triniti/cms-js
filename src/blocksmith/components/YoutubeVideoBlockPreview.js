import React from 'react';
import withBlockPreview from '@triniti/cms/blocksmith/components/withBlockPreview.js';

function YoutubeVideoBlockPreview(props) {
  const { pbj } = props;
  return (
    <p>{JSON.stringify(pbj)}</p>
  );
}

export default withBlockPreview(YoutubeVideoBlockPreview);