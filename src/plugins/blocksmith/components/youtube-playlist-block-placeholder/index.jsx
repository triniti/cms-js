import React from 'react';
import GenericBlockPlaceholder from '@triniti/cms/plugins/blocksmith/components/generic-block-placeholder';

const config = {
  icon: {
    imgSrc: 'youtube',
  },
  label: 'Youtube Playlist Block',
};

export default (props) => <GenericBlockPlaceholder config={config} {...props} />;
