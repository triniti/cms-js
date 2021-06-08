import React from 'react';
import GenericBlockPlaceholder from '@triniti/cms/plugins/blocksmith/components/generic-block-placeholder';
import PreviewComponent from './PreviewComponent';

const config = {
  icon: {
    imgSrc: 'youtube',
  },
  label: 'Youtube Playlist Block',
  preview: {
    component: PreviewComponent,
  },
};

export default (props) => <GenericBlockPlaceholder config={config} {...props} />;
