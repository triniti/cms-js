import { $getRoot, $isElementNode } from 'lexical';
import { isHTMLElement } from '@lexical/utils';
import { $isBlocksmithNode } from '@triniti/cms/blocksmith/nodes/BlocksmithNode.js';

const removeAttributes = (element) => {
  if (!isHTMLElement(element)) {
    return;
  }

  element.removeAttribute('style');
  element.removeAttribute('dir');
  element.removeAttribute('class');

  for (const child of element.children) {
    removeAttributes(child);
  }
};

const appendNode = (editor, node, container) => {
  const shouldExclude = $isElementNode(node) && node.excludeFromCopy('html');
  const children = $isElementNode(node) ? node.getChildren() : [];
  const registeredNode = editor._nodes.get(node.getType());

  // Use HTMLConfig overrides, if available.
  let exportOutput;
  if (registeredNode && registeredNode.exportDOM !== undefined) {
    exportOutput = registeredNode.exportDOM(editor, node);
  } else {
    exportOutput = node.exportDOM(editor);
  }

  const { element, after } = exportOutput;
  if (!element) {
    return;
  }

  removeAttributes(element);
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < children.length; i++) {
    appendNode(editor, children[i], fragment);
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
    const newElement = after.call(node, element);
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
    ;
};

const nodeToHtml = (editor, node) => {
  const container = document.createElement('div');
  appendNode(editor, node, container);
  const html = sanitizeHtml(container.innerHTML) || '';
  if (html === '<p><br></p>') {
    return '';
  }

  return html;
};

// do we need to handle css_class and updated_date on text? one wonders. i hope the fuck not.
// seems like we could do it fairly easily though with a blocksmithnode generation of
// the text and store data on custom text nodes. will noodle later, if needed.
const createTextBlock = (html) => {
  return {
    _schema: `pbj:${APP_VENDOR}:canvas:block:text-block:1-0-0`,
    text: html,
  };
};

export default (editor) => {
  const editorState = editor.getEditorState();
  const blocks = [];

  editorState.read(() => {
    const nodes = $getRoot().getChildren();
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if ($isBlocksmithNode(node)) {
        blocks.push(node.exportJSON().__pbj);
      } else {
        const html = nodeToHtml(editor, node).trim();
        if (html) {
          blocks.push(createTextBlock(html));
        }
      }
    }
  });

  return blocks;
};
