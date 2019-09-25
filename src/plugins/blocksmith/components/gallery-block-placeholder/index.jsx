import React from 'react';
import GenericBlockPlaceholder from '@triniti/cms/plugins/blocksmith/components/generic-block-placeholder';
import GalleryBlockV1Mixin from '@triniti/schemas/triniti/canvas/mixin/gallery-block/GalleryBlockV1Mixin';
import { localize } from '@triniti/cms/plugins/utils/services/Localization';
import siteLogo from 'assets/img/svg/icon/site-logo.svg'; // eslint-disable-line import/no-unresolved
import PreviewComponent from './PreviewComponent';

const config = {
  label: `${localize(GalleryBlockV1Mixin.findOne().getQName().getVendor())} Gallery Block`,
  iconGroup: {
    icons: {
      primary: {
        imgSrc: 'gallery',
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
