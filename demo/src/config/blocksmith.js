export default {
  // possible block level config strategy, if we need it
  /*
  blocks: {
    divider: {
      strokeColors: [
        { label: 'primary', value: 'primary' },
        { label: 'secondary', value: 'secondary' },
      ],
    }
  },
   */
  toolbar: {
    blocks: [
      { type: 'article-block', text: 'Article' },
      { type: 'audio-block', text: 'Audio' },
      { type: 'document-block', text: 'Document' },
      { type: 'eme-form-block', text: 'EME Form' },
      { type: 'gallery-block', text: 'Gallery' },
      { type: 'image-block', text: 'Image' },
      { type: 'poll-block', text: 'Poll' },
      { type: 'poll-grid-block', text: 'Poll Grid' },
      { type: 'quote-block', text: 'Quote' },
      { type: 'video-block', text: 'Video' },
      'separator',
      { type: 'divider-block', text: 'Divider' },
      { type: 'heading-block', text: 'Heading' },
      { type: 'page-break-block', text: 'Page Break' },
      { type: 'text-block', text: 'Paragraph' },
      'separator',
      { type: 'code-block', text: 'Code' },
      { type: 'iframe-block', text: 'Iframe' },
    ],
    externalBlocks: [
      { type: 'facebook-post-block', text: 'Facebook Post' },
      { type: 'facebook-video-block', text: 'Facebook Video' },
      { type: 'google-map-block', text: 'Google Map' },
      { type: 'imgur-post-block', text: 'Imgur Post' },
      { type: 'instagram-media-block', text: 'Instagram Media' },
      { type: 'pinterest-pin-block', text: 'Pinterest Pin' },
      { type: 'soundcloud-audio-block', text: 'SoundCloud Audio' },
      { type: 'spotify-embed-block', text: 'Spotify Embed' },
      { type: 'tiktok-embed-block', text: 'TikTok Embed' },
      { type: 'tumblr-post-block', text: 'Tumblr Post' },
      { type: 'twitter-tweet-block', text: 'Twitter Tweet' },
      { type: 'vimeo-video-block', text: 'Vimeo Video' },
      { type: 'youtube-playlist-block', text: 'YouTube Playlist' },
      { type: 'youtube-video-block', text: 'YouTube Video' },
    ]
  },
};
