import BlocksmithNode from '@triniti/cms/blocksmith/nodes/BlocksmithNode.js';
import { LinkNode } from '@lexical/link';
import customConfig from '@triniti/app/config/blocksmith.js';

const config = {
  namespace: 'blocksmith',
  nodes: [
    BlocksmithNode,
    LinkNode,
  ],
  onError: (error) => {
    // todo: send errors to raven?
    console.error('blocksmith.error', error);
  },
  // todo: remove need for all this theme stuff and just style the elements
  // like .blocksmith h1, .blocksmith ol, etc.  we don't need theming fanciness rn
  theme: {
    link: 'link',
    list: {
      listitem: 'listitem',
      nested: {
        listitem: 'nested-listitem',
      },
      ol: 'list-ol',
      ul: 'list-ul',
    },
    paragraph: 'paragraph',
    placeholder: 'placeholder',
    text: {
      bold: 'text-bold',
      highlight: 'text-highlight',
      italic: 'text-italic',
      overflowed: 'text-overflowed',
      strikethrough: 'text-strikethrough',
      underline: 'text-underline',
      underlineStrikethrough: 'text-underlineStrikethrough',
    },
  },
};

export default { ...config, ...customConfig };
