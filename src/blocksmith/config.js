import BlocksmithNode from '@triniti/cms/blocksmith/nodes/BlocksmithNode.js';

export default {
  namespace: 'blocksmith',
  nodes: [
    BlocksmithNode,
  ],
  onError(error) {
    console.error(error);
  },
  theme: {
    code: 'code',
    heading: {
      h1: 'heading-h1',
      h2: 'heading-h2',
      h3: 'heading-h3',
      h4: 'heading-h4',
      h5: 'heading-h5',
    },
    image: 'image',
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
};