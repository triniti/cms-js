import React from 'react';
import GenericBlockPlaceholder from '@triniti/cms/plugins/blocksmith/components/generic-block-placeholder';
import PreviewComponent from './PreviewComponent';

const config = {
  iconGroup: {
    icons: {
      primary: {
        imgSrc: 'video',
      },
      secondary: {
        imgSrc: 'facebook',
      },
    },
  },
  label: 'Facebook Video Block',
  preview: {
    component: PreviewComponent,
  },
};

export default (props) => <GenericBlockPlaceholder config={config} {...props} />;
