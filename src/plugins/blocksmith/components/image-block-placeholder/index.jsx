import React from 'react';
import GenericBlockPlaceholder from '@triniti/cms/plugins/blocksmith/components/generic-block-placeholder';
import ImageBlockV1Mixin from '@triniti/schemas/triniti/canvas/mixin/image-block/ImageBlockV1Mixin';
import { localize } from '@triniti/cms/plugins/utils/services/Localization';
import siteLogo from 'assets/img/svg/icon/site-logo.svg'; // eslint-disable-line import/no-unresolved
import PreviewComponent from './PreviewComponent';

const config = {
  label: `${localize(ImageBlockV1Mixin.findOne().getQName().getVendor())} Image Block`,
  iconGroup: {
    icons: {
      primary: {
        imgSrc: 'camera',
      },
      secondary: {
        src: siteLogo,
      },
    },
  },
  preview: {
    component: PreviewComponent,
  },
};

export default (props) => <GenericBlockPlaceholder config={config} {...props} />;
