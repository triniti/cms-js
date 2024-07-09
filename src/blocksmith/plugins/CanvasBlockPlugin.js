import { useEffect } from 'react';
import { COMMAND_PRIORITY_EDITOR, createCommand } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import CanvasBlockNode, { $createCanvasBlockNode } from '@triniti/cms/blocksmith/nodes/CanvasBlockNode.js';

export const INSERT_CANVAS_BLOCK_COMMAND = createCommand();

export default function CanvasBlockPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([CanvasBlockNode])) {
      throw new Error('CanvasBlockPlugin: CanvasBlockNode not registered on editor');
    }

    return editor.registerCommand(
      INSERT_CANVAS_BLOCK_COMMAND,
      (payload) => {
        const node = $createCanvasBlockNode(payload);
        $insertNodeToNearestRoot(node);
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
