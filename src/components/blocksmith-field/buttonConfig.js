import siteLogo from '@assets/img/svg/icon/site-logo.svg';

const configs = {
  'article-block': {
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
  },
  'audio-block': {
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
  'code-block': {
    icon: {
      imgSrc: 'code',
    },
  },
  'divider-block': {
    icon: {
      imgSrc: 'minus',
    },
  },
  'document-block': {
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
  },
  'eme-form-block': {
    icon: {
      imgSrc: 'eme',
    },
  },
  'facebook-post-block': {
    iconGroup: {
      icons: {
        primary: {
          imgSrc: 'pencil',
        },
        secondary: {
          imgSrc: 'facebook',
        },
      },
    },
  },
  'facebook-video-block': {
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
  },
  'gallery-block': {
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
  },
  'google-map-block': {
    icon: {
      imgSrc: 'google-maps',
    },
  },
  'heading-block': {
    icon: {
      imgSrc: 'header',
    },
  },
  'iframe-block': {
    icon: {
      imgSrc: 'iframe',
    },
  },
  'image-block': {
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
  },
  'imgur-post-block': {
    icon: {
      imgSrc: 'imgur',
    },
  },
  'instagram-media-block': {
    icon: {
      imgSrc: 'instagram',
    },
  },
  'page-break-block': {
    iconGroup: {
      icons: {
        primary: {
          imgSrc: 'page-break'
        },
        secondary: {
          src: siteLogo
        }
      }
    }
  },
  'pinterest-pin-block': {
    icon: {
      imgSrc: 'pinterest',
    },
  },
  'poll-block': {
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
  },
  'poll-grid-block': {
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
  },
  'quote-block': {
    icon: {
      imgSrc: 'quote',
    },
  },
  'soundcloud-audio-block': {
    icon: {
      imgSrc: 'soundcloud',
    },
  },
  'spotify-embed-block': {
    icon: {
      imgSrc: 'spotify',
    },
  },
  'spotify-track-block': {
    icon: {
      imgSrc: 'spotify',
    },
  },
  'text-block': {
    icon: {
      imgSrc: 'pencil',
    },
  },
  'tiktok-embed-block': {
    icon: {
      imgSrc: 'tiktok',
    },
  },
  'twitter-tweet-block': {
    iconGroup: {
      icons: {
        primary: {
          imgSrc: 'tweet',
        },
        secondary: {
          imgSrc: 'twitter',
        },
      },
    },
  },
  'video-block': {
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
  },
  'vimeo-video-block': {
    icon: {
      imgSrc: 'vimeo',
    },
  },
  'youtube-playlist-block': {
    icon: {
      imgSrc: 'youtube',
    },
  },
  'youtube-video-block': {
    icon: {
      imgSrc: 'youtube',
    },
  },
};

export const getButtonConfig = (message) => configs[message];
