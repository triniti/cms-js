import GenericBlockPlaceholder
  from '@triniti/cms/plugins/blocksmith/components/generic-block-placeholder';
import React from 'react';

const config = {
  icon: {
    imgSrc: 'iframe',
  },
  label: 'Iframe Block',
};

export default (props) => <GenericBlockPlaceholder config={config} {...props} />;
