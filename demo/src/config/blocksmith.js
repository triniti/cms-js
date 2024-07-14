import BlocksmithNode from '@triniti/cms/blocksmith/nodes/BlocksmithNode.js';
import { LinkNode } from '@lexical/link';

export default {
  namespace: 'blocksmith',
  nodes: [
    BlocksmithNode,
    LinkNode,
  ],
  onError: (error) => {
    console.error('blocksmith.error', error);
  },
  // todo: remove need for all this theme stuff and just style the elements
  // like .blocksmith h1, .blocksmith ol, etc.  we don't need theming fanciness rn
  theme: {
    code: 'code',
    heading: {
      h1: 'heading-h1',
      h2: 'heading-h2',
      h3: 'heading-h3',
      h4: 'heading-h4',
      h5: 'heading-h5',
    },
    link: 'link',
    list: {
      listitem: 'listitem',
      nested: {
        listitem: 'nested-listitem',
      },
      ol: 'list-ol',
      ul: 'list-ul',
    },
    ltr: 'ltr',
    paragraph: 'paragraph',
    placeholder: 'placeholder',
    quote: 'quote',
    rtl: 'rtl',
    text: {
      bold: 'text-bold',
      code: 'text-code',
      hashtag: 'text-hashtag',
      italic: 'text-italic',
      overflowed: 'text-overflowed',
      strikethrough: 'text-strikethrough',
      underline: 'text-underline',
      underlineStrikethrough: 'text-underlineStrikethrough',
    },
  },
  toolbar: {
    blocks: [
      { type: 'article-block', text: 'Article' },
      { type: 'youtube-video-block', text: 'YouTube Video' },
      'separator',
      { type: 'image-block', text: 'Image' },
      { type: 'video-block', text: 'Video' },
    ],
  },
};
