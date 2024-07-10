import { useEffect } from 'react';
import { $getRoot, COMMAND_PRIORITY_EDITOR, createCommand } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import BlocksmithNode, {
  $createBlocksmithNode,
  $isBlocksmithNode
} from '@triniti/cms/blocksmith/nodes/BlocksmithNode.js';
import nodeToHtml from '@triniti/cms/blocksmith/utils/nodeToHtml.js';

export const INSERT_BLOCKSMITH_BLOCK_COMMAND = createCommand();

export default function BlocksmithPlugin(props) {
  const { delegateRef } = props;
  const [editor] = useLexicalComposerContext();
  const TextBlockV1 = delegateRef.current.TextBlockV1;

  useEffect(() => {
    if (!editor.hasNodes([BlocksmithNode])) {
      throw new Error('BlocksmithPlugin: BlocksmithNode not registered on editor');
    }

    delegateRef.current.handleChange = (editorState) => {
      const blocks = [];
      editorState.read(() => {
        const nodes = $getRoot().getChildren();
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          if ($isBlocksmithNode(node)) {
            blocks.push(node.exportJSON().__pbj);
          } else {
            const html = nodeToHtml(editor, node);
            blocks.push(TextBlockV1.create().set('text', html).toObject());
          }
        }
      });

      console.log('handleChange.blocks', blocks);
    };

    return editor.registerCommand(
      INSERT_BLOCKSMITH_BLOCK_COMMAND,
      (payload) => {
        const node = $createBlocksmithNode(payload.curie, payload.pbj);
        $insertNodeToNearestRoot(node);
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
