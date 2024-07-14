import { useEffect, useRef } from 'react';
import noop from 'lodash-es/noop.js';
import { $createParagraphNode, $getNodeByKey, COMMAND_PRIORITY_EDITOR, createCommand } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodeToNearestRoot, mergeRegister } from '@lexical/utils';
import BlocksmithNode, { $createBlocksmithNode } from '@triniti/cms/blocksmith/nodes/BlocksmithNode.js';
import { useFormContext } from '@triniti/cms/components/index.js';
import areBlocksEqual from '@triniti/cms/blocksmith/utils/areBlocksEqual.js';
import blocksToEditor from '@triniti/cms/blocksmith/utils/blocksToEditor.js';
import editorToBlocks from '@triniti/cms/blocksmith/utils/editorToBlocks.js';

export const INSERT_BLOCKSMITH_BLOCK_COMMAND = createCommand();
export const REMOVE_BLOCKSMITH_BLOCK_COMMAND = createCommand();
export const BLOCKSMITH_DIRTY = 'blocksmith.dirty';
export const BLOCKSMITH_HYDRATION = 'blocksmith.hydration';

export default function BlocksmithPlugin(props) {
  const { name = 'blocks' } = props;
  const formContext = useFormContext();
  const { editMode, form, pbj } = formContext;
  const [editor] = useLexicalComposerContext();
  const initialValueRef = useRef(null);

  useEffect(() => {
    if (!editor.hasNodes([BlocksmithNode])) {
      throw new Error('BlocksmithPlugin: BlocksmithNode not registered on editor');
    }

    const checkDirtyOnBlurListener = () => {
      const blocks = editorToBlocks(editor);
      const newValue = blocks.length > 0 ? blocks : undefined;
      if (areBlocksEqual(newValue, initialValueRef.current)) {
        form.change(name, initialValueRef.current);
      }
    };

    return mergeRegister(
      editor.registerRootListener((rootElement, prevRootElement) => {
        if (rootElement) {
          rootElement.addEventListener('blur', checkDirtyOnBlurListener);
        }
        if (prevRootElement) {
          prevRootElement.removeEventListener('blur', checkDirtyOnBlurListener);
        }
      }),
      editor.registerUpdateListener((details) => {
        const { dirtyElements, dirtyLeaves, prevEditorState, tags } = details;
        if (tags.has(BLOCKSMITH_HYDRATION)) {
          return;
        }

        if ((dirtyElements.size === 0 && dirtyLeaves.size === 0) || tags.has('history-merge') || prevEditorState.isEmpty()) {
          // this dirty check seems kinda flaky, nodes have subtle changes when using formatting
          //form.change(name, editorStateRef.current);
          return;
        }

        form.change(name, BLOCKSMITH_DIRTY);
      }),
      editor.registerCommand(INSERT_BLOCKSMITH_BLOCK_COMMAND, (payload) => {
        const $node = $createBlocksmithNode(payload.curie, payload.pbj);
        $insertNodeToNearestRoot($node);
        return true;
      }, COMMAND_PRIORITY_EDITOR),
      editor.registerCommand(REMOVE_BLOCKSMITH_BLOCK_COMMAND, (nodeKey) => {
        const $node = $getNodeByKey(nodeKey);
        if ($node) {
          $node.replace($createParagraphNode());
        }
        return true;
      }, COMMAND_PRIORITY_EDITOR)
    );
  }, [editor]);

  useEffect(() => {
    editor.setEditable(editMode);
  }, [editMode]);

  useEffect(() => {
    if (!pbj) {
      return;
    }

    setTimeout(() => {
      const blocks = pbj.get('blocks', []);
      blocksToEditor(blocks, editor);
      initialValueRef.current = blocks.length > 0 ? blocks.map(b => b.toObject()) : undefined;
      form.registerField(name, noop, {}, {
        isEqual: areBlocksEqual,
        initialValue: initialValueRef.current,
        beforeSubmit: () => {
          const blocks = editorToBlocks(editor);
          form.change('blocks', blocks);
        }
      });
    });
  }, [pbj]);

  return null;
}
