import { $isElementNode } from 'lexical';
import { isHTMLElement } from '@lexical/utils';

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
    .replaceAll('</i>', '</em>');
};

export default (editor, node) => {
  const container = document.createElement('div');
  appendNode(editor, node, container);
  return sanitizeHtml(container.innerHTML);
};
