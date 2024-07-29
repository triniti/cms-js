import { $getRoot, $isElementNode } from 'lexical';
import { isHTMLElement } from '@lexical/utils';
import { $isBlocksmithNode } from '@triniti/cms/blocksmith/nodes/BlocksmithNode.js';
import marshalToFinalForm from '@triniti/cms/blocksmith/utils/marshalToFinalForm.js';

const removeAttributes = (element) => {
  if (!isHTMLElement(element)) {
    return;
  }

  element.removeAttribute('class');
  element.removeAttribute('dir');
  element.removeAttribute('style');
  element.removeAttribute('title');
  element.removeAttribute('value');

  for (const child of element.children) {
    removeAttributes(child);
  }
};

const appendNode = (editor, $node, container) => {
  const shouldExclude = $isElementNode($node) && $node.excludeFromCopy('html');
  const $children = $isElementNode($node) ? $node.getChildren() : [];
  const $registeredNode = editor._nodes.get($node.getType());

  // Use HTMLConfig overrides, if available.
  let exportOutput;
  if ($registeredNode && $registeredNode.exportDOM !== undefined) {
    exportOutput = $registeredNode.exportDOM(editor, $node);
  } else {
    exportOutput = $node.exportDOM(editor);
  }

  const { element, after } = exportOutput;
  if (!element) {
    return;
  }

  removeAttributes(element);
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < $children.length; i++) {
    appendNode(editor, $children[i], fragment);
  }

  if (shouldExclude) {
    container.append(fragment);
    return;
  }

  if (isHTMLElement(element)) {
    element.append(fragment);
  }

  container.append(element);

  if (after) {
    const newElement = after.call($node, element);
    removeAttributes(newElement);
    if (newElement) {
      element.replaceWith(newElement);
    }
  }
};

// eh, should we accept the lexical output as gospel? maybe.
const sanitizeHtml = (html) => {
  return html
    .replaceAll('<span>', '')
    .replaceAll('</span>', '')
    .replaceAll('<b>', '')
    .replaceAll('</b>', '')
    .replaceAll('<i>', '<em>')
    .replaceAll('</i>', '</em>')
    .replaceAll('<em><em>', '<em>')
    .replaceAll('</em></em>', '</em>')
    .replaceAll(' style=""', '');
    ;
};

const nodeToHtml = (editor, $node) => {
  const container = document.createElement('div');
  appendNode(editor, $node, container);
  return sanitizeHtml(container.innerHTML) || '';
};

const EMPTY_TEXT_BLOCKS = ['<p><br></p>', '<ol><li></li></ol>', '<ul><li></li></ul>'];
const isEmptyBlock = (block) => {
  if (!block._schema.includes('text-block')) {
    return false;
  }

  for (let i = 0; i < EMPTY_TEXT_BLOCKS.length; i++) {
    if (block.text === EMPTY_TEXT_BLOCKS[i]) {
      return true;
    }
  }
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
