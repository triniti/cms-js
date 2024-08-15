import { $getRoot } from 'lexical';
import { $isBlocksmithNode } from '@triniti/cms/blocksmith/nodes/BlocksmithNode.js';
import marshalToFinalForm from '@triniti/cms/blocksmith/utils/marshalToFinalForm.js';
import nodeToHtml from '@triniti/cms/blocksmith/utils/nodeToHtml.js';

const EMPTY_TEXT_BLOCKS = ['<p><br></p>', '<p>&nbsp;</p>', '<p></p>', '<ol><li></li></ol>', '<ul><li></li></ul>'];
const isEmptyBlock = (block) => {
  if (!block._schema.includes('text-block')) {
    return false;
  }

  for (let i = 0; i < EMPTY_TEXT_BLOCKS.length; i++) {
    if (block.text === EMPTY_TEXT_BLOCKS[i]) {
      return true;
    }
  }

  return false;
};

// do we need to handle css_class and updated_date on text? one wonders. i hope the fuck not.
// seems like we could do it fairly easily though with a blocksmithnode generation of
// the text and store data on custom text nodes. will noodle later, if needed.
const createTextBlock = (html) => {
  return {
    _schema: `pbj:${APP_VENDOR}:canvas:block:text-block:1-0-0`,
    aside: false,
    text: html,
  };
};

export default (editor) => {
  const editorState = editor.getEditorState();
  const blocks = [];

  editorState.read(() => {
    const $nodes = $getRoot().getChildren();
    for (let i = 0; i < $nodes.length; i++) {
      const $node = $nodes[i];
      if ($isBlocksmithNode($node)) {
        blocks.push(marshalToFinalForm($node.exportJSON().__pbj));
      } else {
        const html = nodeToHtml(editor, $node).trim();
        if (html) {
          blocks.push(createTextBlock(html));
        }
      }
    }
  });

  if (blocks.length === 0) {
    return blocks;
  }

  do {
    if (!isEmptyBlock(blocks[0])) {
      break;
    }
    blocks.shift();
  } while (blocks.length > 0);

  if (blocks.length === 0) {
    return blocks;
  }

  do {
    if (!isEmptyBlock(blocks[blocks.length - 1])) {
      break;
    }
    blocks.pop();
  } while (blocks.length > 0);

  return blocks;
};
