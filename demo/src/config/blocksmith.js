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
      { type: 'article-block', text: 'Article', icon: 'book-open' },
      { type: 'audio-block', text: 'Audio', icon: 'audio' },
      { type: 'document-block', text: 'Document', icon: 'document' },
      { type: 'eme-form-block', text: 'EME Form', icon: 'short-text' },
      { type: 'gallery-block', text: 'Gallery', icon: 'gallery' },
      { type: 'image-block', text: 'Image', icon: 'camera' },
      { type: 'poll-block', text: 'Poll', icon: 'poll' },
      { type: 'poll-grid-block', text: 'Poll Grid', icon: 'poll-grid' },
      { type: 'quote-block', text: 'Quote', icon: 'quote' },
      { type: 'video-block', text: 'Video', icon: 'play-outline' },
      'separator',
      { type: 'divider-block', text: 'Divider', icon: 'minus-line' },
      { type: 'heading-block', text: 'Heading', icon: 'header' },
      { type: 'page-break-block', text: 'Page Break', icon: 'page-break' },
      { type: 'text-block', text: 'Paragraph', icon: 'paragraph' },
      'separator',
      { type: 'code-block', text: 'Code', icon: 'code' },
      { type: 'iframe-block', text: 'Iframe', icon: 'iframe' },
    ],
    externalBlocks: [
      { type: 'facebook-post-block', text: 'Facebook Post', icon: 'facebook-circle' },
      { type: 'facebook-video-block', text: 'Facebook Video', icon: 'facebook' },
      { type: 'google-map-block', text: 'Google Map', icon: 'google' },
      { type: 'imgur-post-block', text: 'Imgur Post', icon: 'imgur' },
      { type: 'instagram-media-block', text: 'Instagram Media', icon: 'instagram' },
      { type: 'pinterest-pin-block', text: 'Pinterest Pin', icon: 'pinterest' },
      { type: 'soundcloud-audio-block', text: 'SoundCloud Audio', icon: 'soundcloud' },
      { type: 'spotify-embed-block', text: 'Spotify Embed', icon: 'spotify' },
      { type: 'tiktok-embed-block', text: 'TikTok Embed', icon: 'tiktok' },
      { type: 'tumblr-post-block', text: 'Tumblr Post', icon: 'tumblr' },
      { type: 'twitter-tweet-block', text: 'Twitter Tweet', icon: 'x' },
      { type: 'vimeo-video-block', text: 'Vimeo Video', icon: 'vimeo' },
      { type: 'youtube-playlist-block', text: 'YouTube Playlist', icon: 'playlist' },
      { type: 'youtube-video-block', text: 'YouTube Video', icon: 'youtube' },
    ]
  },
};
