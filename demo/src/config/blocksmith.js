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
      { type: 'image-block', text: 'Image' },
      { type: 'heading-block', text: 'Heading' },
      { type: 'article-block', text: 'Article' },
      { type: 'quote-block', text: 'Quote' },
      { type: 'poll-block', text: 'Poll' },
      { type: 'poll-grid-block', text: 'Poll Grid' },
      { type: 'youtube-video-block', text: 'YouTube Video' },
      'separator',
      { type: 'image-block', text: 'Image' },
      { type: 'gallery-block', text: 'Gallery' },
      { type: 'video-block', text: 'Video' },
      { type: 'audio-block', text: 'Audio' },
      { type: 'document-block', text: 'Document' },
      { type: 'divider-block', text: 'Divider' },
      { type: 'page-break-block', text: 'Page Break' },
      { type: 'eme-form-block', text: 'EME Form' },
      { type: 'facebook-post-block', text: 'Facebook Post' },
      { type: 'facebook-video-block', text: 'Facebook Video' },
      { type: 'google-map-block', text: 'Google Map' },
      { type: 'code-block', text: 'Code' },
      { type: 'iframe-block', text: 'Iframe' },
      { type: 'imgur-post-block', text: 'Imgur Post' },
      { type: 'instagram-media-block', text: 'Instagram Media' },
      { type: 'pinterest-pin-block', text: 'Pinterest Pin' },
    ],
  },
};
