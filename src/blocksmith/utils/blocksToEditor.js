import { isBlockDomNode } from '@lexical/utils';
import {
  $createLineBreakNode,
  $createParagraphNode,
  $getRoot,
  $insertNodes,
  $isBlockElementNode,
  $isElementNode,
  $isRootOrShadowRoot,
  ArtificialNode__DO_NOT_USE
} from 'lexical';
import { $createBlocksmithNode } from '@triniti/cms/blocksmith/nodes/BlocksmithNode.js';
import { BLOCKSMITH_HYDRATION } from '@triniti/cms/blocksmith/plugins/BlocksmithPlugin.js';

const getConversionFunction = (domNode, editor) => {
  const { nodeName } = domNode;
  const cachedConversions = editor._htmlConversions.get(nodeName.toLowerCase());
  let currentConversion = null;

  if (cachedConversions !== undefined) {
    for (const cachedConversion of cachedConversions) {
      const domConversion = cachedConversion(domNode)
      if (domConversion !== null && (currentConversion === null || (currentConversion.priority || 0) < (domConversion.priority || 0))) {
        currentConversion = domConversion;
      }
    }
  }

  return currentConversion !== null ? currentConversion.conversion : null;
}

const IGNORE_TAGS = new Set(['STYLE', 'SCRIPT']);

const createNodesFromDom = (node, editor, allArtificialNodes, hasBlockAncestorLexicalNode, forChildMap = new Map(), parentLexicalNode) => {
  let lexicalNodes = [];

  if (IGNORE_TAGS.has(node.nodeName)) {
    return lexicalNodes
  }

  let currentLexicalNode = null;
  const transformFunction = getConversionFunction(node, editor);
  const transformOutput = transformFunction ? transformFunction(node) : null;
  let postTransform = null;

  if (transformOutput !== null) {
    postTransform = transformOutput.after;
    const transformNodes = transformOutput.node;
    currentLexicalNode = Array.isArray(transformNodes)
      ? transformNodes[transformNodes.length - 1]
      : transformNodes;

    if (currentLexicalNode !== null) {
      for (const [, forChildFunction] of forChildMap) {
        currentLexicalNode = forChildFunction(
          currentLexicalNode,
          parentLexicalNode
        );

        if (!currentLexicalNode) {
          break;
        }
      }

      if (currentLexicalNode) {
        lexicalNodes.push(...(Array.isArray(transformNodes) ? transformNodes : [currentLexicalNode]));
      }
    }

    if (transformOutput.forChild != null) {
      forChildMap.set(node.nodeName, transformOutput.forChild);
    }
  }

  // If the DOM node doesn't have a transformer, we don't know what
  // to do with it but we still need to process any childNodes.
  const children = node.childNodes;
  let childLexicalNodes = [];

  const hasBlockAncestorLexicalNodeForChildren = currentLexicalNode != null && $isRootOrShadowRoot(currentLexicalNode)
    ? false
    : (currentLexicalNode != null && $isBlockElementNode(currentLexicalNode)) || hasBlockAncestorLexicalNode;

  for (let i = 0; i < children.length; i++) {
    childLexicalNodes.push(
      ...createNodesFromDom(
        children[i],
        editor,
        allArtificialNodes,
        hasBlockAncestorLexicalNodeForChildren,
        new Map(forChildMap),
        currentLexicalNode
      )
    );
  }

  if (postTransform != null) {
    childLexicalNodes = postTransform(childLexicalNodes);
  }

  if (isBlockDomNode(node)) {
    if (!hasBlockAncestorLexicalNodeForChildren) {
      childLexicalNodes = wrapContinuousInlines(node, childLexicalNodes, $createParagraphNode);
    } else {
      childLexicalNodes = wrapContinuousInlines(node, childLexicalNodes, () => {
        const artificialNode = new ArtificialNode__DO_NOT_USE();
        allArtificialNodes.push(artificialNode);
        return artificialNode;
      });
    }
  }

  if (currentLexicalNode == null) {
    // If it hasn't been converted to a LexicalNode, we hoist its children
    // up to the same level as it.
    lexicalNodes = lexicalNodes.concat(childLexicalNodes);
  } else {
    if ($isElementNode(currentLexicalNode)) {
      // If the current node is a ElementNode after conversion,
      // we can append all the children to it.
      currentLexicalNode.append(...childLexicalNodes);
    }
  }

  return lexicalNodes;
};

const wrapContinuousInlines = (domNode, nodes, createWrapperFn) => {
  const textAlign = domNode.style.textAlign;
  const out = [];
  let continuousInlines = [];
  // wrap contiguous inline child nodes in para
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if ($isBlockElementNode(node)) {
      if (textAlign && !node.getFormat()) {
        node.setFormat(textAlign);
      }
      out.push(node);
    } else {
      continuousInlines.push(node);
      if (i === nodes.length - 1 || (i < nodes.length - 1 && $isBlockElementNode(nodes[i + 1]))) {
        const wrapper = createWrapperFn();
        wrapper.setFormat(textAlign);
        wrapper.append(...continuousInlines);
        out.push(wrapper);
        continuousInlines = [];
      }
    }
  }
  return out;
};

const unwrapArtificalNodes = (allArtificialNodes) => {
  for (const node of allArtificialNodes) {
    if (node.getNextSibling() instanceof ArtificialNode__DO_NOT_USE) {
      node.insertAfter($createLineBreakNode());
    }
  }
  // Replace artificial node with it's children
  for (const node of allArtificialNodes) {
    const children = node.getChildren();
    for (const child of children) {
      node.insertBefore(child);
    }
    node.remove();
  }
};

const htmlToNode = (editor, dom) => {
  const elements = dom.body ? dom.body.childNodes : [];
  let lexicalNodes = [];
  const allArtificialNodes = []
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i]
    if (!IGNORE_TAGS.has(element.nodeName)) {
      const lexicalNode = createNodesFromDom(element, editor, allArtificialNodes, false);
      if (lexicalNode !== null) {
        lexicalNodes = lexicalNodes.concat(lexicalNode);
      }
    }
  }

  unwrapArtificalNodes(allArtificialNodes);
  return lexicalNodes;
};

export default (blocks, editor) => {
  editor.update(() => {
    const parser = new DOMParser();
    const $nodes = [];
    let addParagraph = false;
    for (const block of blocks) {
      const curie = block.schema().getCurie();
      if (curie.getMessage() === 'text-block') {
        if (block.has('text')) {
          const dom = parser.parseFromString(block.get('text'), 'text/html');
          $nodes.push(...htmlToNode(editor, dom));
          addParagraph = false;
        }
      } else {
        $nodes.push($createBlocksmithNode(curie.toString(), block.toObject()));
        addParagraph = true;
      }
    }

    // better user experience to have this at the end when
    // the last node was blocksmith block.
    if (addParagraph && editor.isEditable()) {
      $nodes.push($createParagraphNode());
    }

    $getRoot().clear().select();
    $insertNodes($nodes);
    $getRoot().selectStart();
  }, { discrete: true, tag: BLOCKSMITH_HYDRATION });
};
