import { $createParagraphNode, $getRoot, $insertNodes } from 'lexical';
import { $generateNodesFromDOM } from '@lexical/html';
import { $createBlocksmithNode } from '@triniti/cms/blocksmith/nodes/BlocksmithNode.js';
import { BLOCKSMITH_HYDRATION } from '@triniti/cms/blocksmith/plugins/BlocksmithPlugin.js';

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
          $nodes.push(...$generateNodesFromDOM(editor, dom));
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
