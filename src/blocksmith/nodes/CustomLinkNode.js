import { $isLinkNode, LinkNode } from '@lexical/link';

/**
 * CustomLinkNode extends LinkNode to provide better control over link behavior,
 * particularly around text insertion and link continuation.
 */
export default class CustomLinkNode extends LinkNode {
  static getType() {
    return 'link';
  }

  static clone(node) {
    return new CustomLinkNode(
      node.__url,
      {
        rel: node.__rel,
        target: node.__target,
        title: node.__title,
      },
      node.__key,
    );
  }

  static importJSON(serializedNode) {
    const node = $createCustomLinkNode(serializedNode.url, {
      rel: serializedNode.rel,
      target: serializedNode.target,
      title: serializedNode.title,
    });
    node.setFormat(serializedNode.format);
    node.setIndent(serializedNode.indent);
    node.setDirection(serializedNode.direction);
    return node;
  }

  static importDOM() {
    return LinkNode.importDOM();
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      type: 'link',
      version: 1,
    };
  }

  /**
   * Override extractWithChild to control extraction behavior during copy/paste.
   * Returning false allows children to be extracted without the link wrapper.
   */
  extractWithChild(child, selection, destination) {
    return false;
  }

  /**
   * Override insertNewAfter to prevent unwanted link continuation.
   * When pressing Enter at the end of a link, the new paragraph should not be linked.
   */
  insertNewAfter(selection, restoreSelection = true) {
    const element = this.getParentOrThrow().insertNewAfter(selection, restoreSelection);
    if (element && this.getChildrenSize() === 0) {
      this.remove();
    }
    return element;
  }

  /**
   * Prevent text insertion before the link.
   */
  canInsertTextBefore() {
    return false;
  }

  /**
   * Prevent text insertion after the link.
   */
  canInsertTextAfter() {
    return false;
  }

  /**
   * Only allow merging with other CustomLinkNodes.
   */
  canMergeWith(node) {
    return super.canMergeWith(node) && node instanceof CustomLinkNode;
  }
}

export function $createCustomLinkNode(url, attributes) {
  return new CustomLinkNode(url, attributes);
}

export function $isCustomLinkNode(node) {
  return node instanceof CustomLinkNode;
}

export { $isLinkNode };
