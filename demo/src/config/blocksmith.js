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
      { type: 'youtube-video-block', text: 'YouTube Video' },
      { type: 'divider-block', text: 'Divider' },
      'separator',
      { type: 'image-block', text: 'Image' },
      { type: 'video-block', text: 'Video' },
      { type: 'audio-block', text: 'Audio' },
      { type: 'code-block', text: 'Code' },
    ],
  },
};
