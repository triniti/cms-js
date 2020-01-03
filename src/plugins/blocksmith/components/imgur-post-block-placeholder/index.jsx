import React from 'react';
import GenericBlockPlaceholder from '@triniti/cms/plugins/blocksmith/components/generic-block-placeholder';

const config = {
  icon: {
    imgSrc: 'imgur',
  },
  label: 'Imgur Post Block',
};

export default (props) => <GenericBlockPlaceholder config={config} {...props} />;
