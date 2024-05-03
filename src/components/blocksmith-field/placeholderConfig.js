import MessageResolver from '@gdbots/pbj/MessageResolver.js';
import { localize } from '@triniti/cms/plugins/utils/services/Localization.js';
import siteLogo from '@triniti/app/assets/img/svg/icon/site-logo.svg';
import GenericBlockPreviewComponent from '@triniti/cms/components/blocksmith-field/components/generic-block-placeholder-preview/index.js';

const vendor = localize(MessageResolver.getDefaultVendor());

const configs = {
  'article-block': {
    label: `${vendor} Article Block`,
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
      component: GenericBlockPreviewComponent,
    },
  },
  'audio-block': {
    label: `${vendor} Audio Block`,
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
    preview: {
      component: GenericBlockPreviewComponent,
    },
  },
  'code-block': {
    icon: {
      imgSrc: 'code',
    },
    label: 'Code Block',
  },
  'divider-block': {
    icon: {
      imgSrc: 'minus',
    },
    label: 'Divider Block',
  },
  'document-block': {
    label: `${vendor} Document Block`,
    iconGroup: {
      icons: {
        primary: {
          imgSrc: 'document',
        },
        secondary: {
          src: siteLogo,
        },
      },
    },
    preview: {
      component: GenericBlockPreviewComponent,
    },
  },
  'eme-form-block': {
    icon: {
      imgSrc: 'eme',
    },
    label: 'EME Form Block',
  },
  'facebook-post-block': {
    icon: {
      imgSrc: 'facebook',
    },
    label: 'Facebook Post Block',
  },
  'facebook-video-block': {
    icon: {
      imgSrc: 'facebook',
    },
    label: 'Facebook Video Block',
    preview: {
      component: GenericBlockPreviewComponent,
    },
  },
  'gallery-block': {
    label: `${vendor} Gallery Block`,
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
      component: GenericBlockPreviewComponent,
    },
  },
  'google-map-block': {
    icon: {
      imgSrc: 'google-maps',
    },
    label: 'Google Map Block',
  },
  'heading-block': {
    icon: {
      imgSrc: 'header',
    },
    label: 'Heading Block',
  },
  'iframe-block': {
    icon: {
      imgSrc: 'iframe',
    },
    label: 'Iframe Block',
  },
  'image-block': {
    icon: {
      imgSrc: 'camera',
    },
    label: 'Image Block',
    preview: {
      component: GenericBlockPreviewComponent,
    },
  },
  'imgur-post-block': {
    icon: {
      imgSrc: 'imgur',
    },
    label: 'Imgur Post Block',
  },
  'instagram-media-block': {
    icon: {
      imgSrc: 'instagram',
    },
    label: 'Instagram Block',
  },
  'page-break-block': {
    icon: {
      imgSrc: 'page-break',
    },
    label: 'Page Break Block',
  },
  'pinterest-pin-block': {
    icon: {
      imgSrc: 'pinterest',
    },
    label: 'Pinterest Pin Block',
  },
  'poll-block': {
    label: `${vendor} Poll Block`,
    iconGroup: {
      icons: {
        primary: {
          imgSrc: 'poll',
        },
        secondary: {
          src: siteLogo,
        },
      },
    },
    preview: {
      component: GenericBlockPreviewComponent,
    },
  },
  'poll-grid-block': {
    label: `${vendor} Poll Grid Block`,
    iconGroup: {
      icons: {
        primary: {
          imgSrc: 'poll-grid',
        },
        secondary: {
          src: siteLogo,
        },
      },
    },
    preview: {
      component: GenericBlockPreviewComponent,
    },
  },
  'quote-block': {
    icon: {
      imgSrc: 'quote',
    },
    label: 'Quote Block',
  },
  'soundcloud-audio-block': {
    icon: {
      imgSrc: 'soundcloud',
    },
    label: 'Soundcloud Audio Block',
    preview: {
      component: GenericBlockPreviewComponent,
    },
  },
  'spotify-embed-block': {
    icon: {
      imgSrc: 'spotify',
    },
    label: 'Spotify Embed Block',
  },
  'spotify-track-block': {
    icon: {
      imgSrc: 'spotify',
    },
    label: 'Spotify Track Block',
  },
  'tiktok-embed-block': {
    icon: {
      imgSrc: 'tiktok',
    },
    label: 'TikTok Embed Block',
  },
  'twitter-tweet-block': {
    icon: {
      imgSrc: 'twitter',
    },
    label: 'Twitter Tweet Block',
  },
  'video-block': {
    label: `${vendor} Video Block`,
    iconGroup: {
      icons: {
        primary: {
          imgSrc: 'video',
        },
        secondary: {
          src: siteLogo,
        },
      },
    },
    preview: {
      component: GenericBlockPreviewComponent,
    },
  },
  'vimeo-video-block': {
    icon: {
      imgSrc: 'vimeo',
    },
    label: 'Vimeo Video Block',
    preview: {
      component: GenericBlockPreviewComponent,
    },
  },
  'youtube-playlist-block': {
    icon: {
      imgSrc: 'youtube',
    },
    label: 'Youtube Playlist Block',
    preview: {
      component: GenericBlockPreviewComponent,
    },
  },
  'youtube-video-block': {
    icon: {
      imgSrc: 'youtube',
    },
    label: 'Youtube Video Block',
  },
};

export const getPlaceholderConfig = (message) => configs[message];
