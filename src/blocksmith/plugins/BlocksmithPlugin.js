import { useEffect } from 'react';
import { COMMAND_PRIORITY_EDITOR, createCommand } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import BlocksmithNode, { $createBlocksmithNode } from '@triniti/cms/blocksmith/nodes/BlocksmithNode.js';
import { useFormContext } from '@triniti/cms/components/index.js';
import blocksToEditor from '@triniti/cms/blocksmith/utils/blocksToEditor.js';
import editorToBlocks from '@triniti/cms/blocksmith/utils/editorToBlocks.js';

export const INSERT_BLOCKSMITH_BLOCK_COMMAND = createCommand();
export const BLOCKSMITH_DIRTY_SYMBOL = Symbol('BLOCKSMITH_DIRTY');

export default function BlocksmithPlugin(props) {
  const { name = 'blocks', delegateRef } = props;
  const formContext = useFormContext();
  const { editMode, form, pbj } = formContext;
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([BlocksmithNode])) {
      throw new Error('BlocksmithPlugin: BlocksmithNode not registered on editor');
    }

    // just want to keep track of dirty whenever editor changes
    delegateRef.current.handleChange = (editorState) => {
      console.log('editorState', JSON.stringify(editorState.toJSON()));
      form.change('blocks', BLOCKSMITH_DIRTY_SYMBOL);
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

  useEffect(() => {
    editor.setEditable(editMode);
  }, [editMode]);

  useEffect(() => {
    if (!pbj) {
      return;
    }

    const subscriber = (fieldState) => console.log('blocksmith.fieldState', name, fieldState);
    const unsubscribe = form.registerField(name, subscriber, { values: true }, {
      beforeSubmit: () => {
        const blocks = editorToBlocks(editor);
        form.change('blocks', blocks);
      }
    });

    if (pbj.has('blocks')) {
      blocksToEditor(pbj.get('blocks'), editor);
    }

    return () => {
      unsubscribe();
    };
  }, [pbj]);

  return null;
}
