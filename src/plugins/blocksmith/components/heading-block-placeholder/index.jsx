import React from 'react';
import GenericBlockPlaceholder from '@triniti/cms/plugins/blocksmith/components/generic-block-placeholder';
import { localize } from '@triniti/cms/plugins/utils/services/Localization';
import HeadingBlockV1Mixin from '@triniti/schemas/triniti/canvas/mixin/heading-block/HeadingBlockV1Mixin';
import siteLogo from 'assets/img/svg/icon/site-logo.svg'; // eslint-disable-line import/no-unresolved

const config = {
  label: `${localize(HeadingBlockV1Mixin.findOne().getQName().getVendor())} Heading Block`,
  iconGroup: {
    icons: {
      primary: {
        imgSrc: 'header',
      },
      secondary: {
        src: siteLogo,
      },
    },
  },
};

export default (props) => <GenericBlockPlaceholder config={config} {...props} />;
