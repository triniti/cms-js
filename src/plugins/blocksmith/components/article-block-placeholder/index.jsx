import React from 'react';
import GenericBlockPlaceholder from '@triniti/cms/plugins/blocksmith/components/generic-block-placeholder';
import ArticleBlockV1Mixin from '@triniti/schemas/triniti/canvas/mixin/article-block/ArticleBlockV1Mixin';
import { localize } from '@triniti/cms/plugins/utils/services/Localization';
import siteLogo from 'assets/img/svg/icon/site-logo.svg'; // eslint-disable-line import/no-unresolved
import PreviewComponent from './PreviewComponent';

const config = {
  label: `${localize(ArticleBlockV1Mixin.findOne().getQName().getVendor())} Article Block`,
  iconGroup: {
    icons: {
      primary: {
        imgSrc: 'book-open',
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
