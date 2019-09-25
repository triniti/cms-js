import decorateComponentWithProps from 'decorate-component-with-props';
import GenericSidebarButton from '@triniti/cms/plugins/blocksmith/components/generic-sidebar-button';
import siteLogo from 'assets/img/svg/icon/site-logo.svg'; // eslint-disable-line import/no-unresolved

export default decorateComponentWithProps(GenericSidebarButton, {
  config: {
    iconGroup: {
      icons: {
        primary: {
          imgSrc: 'audio',
        },
        secondary: {
          src: siteLogo,
        },
      },
    },
  },
});
