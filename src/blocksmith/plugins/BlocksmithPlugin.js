import { useEffect, useRef } from 'react';
import noop from 'lodash-es/noop.js';
import {
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $getRoot,
  createCommand,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
  PASTE_COMMAND,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNearestBlockElementAncestorOrThrow, mergeRegister } from '@lexical/utils';
import { LinkNode } from '@lexical/link';
import BlocksmithNode, { $createBlocksmithNode } from '@triniti/cms/blocksmith/nodes/BlocksmithNode.js';
import { getScrollTop, scrollToTop } from '@triniti/cms/components/screen/index.js';
import { useFormContext } from '@triniti/cms/components/index.js';
import areBlocksEqual from '@triniti/cms/blocksmith/utils/areBlocksEqual.js';
import blocksToEditor from '@triniti/cms/blocksmith/utils/blocksToEditor.js';
import editorToBlocks from '@triniti/cms/blocksmith/utils/editorToBlocks.js';
import getSelectedNode from '@triniti/cms/blocksmith/utils/getSelectedNode.js';
import marshalToFinalForm from '@triniti/cms/blocksmith/utils/marshalToFinalForm.js';
import sanitizeNodes from '@triniti/cms/blocksmith/utils/sanitizeNodes.js';

export const INSERT_BLOCK_COMMAND = createCommand();
export const REMOVE_BLOCK_COMMAND = createCommand();
export const REPLACE_BLOCK_COMMAND = createCommand();
export const BLOCKSMITH_DIRTY = 'blocksmith.dirty';
export const BLOCKSMITH_HYDRATION = 'blocksmith.hydration';
export const BLOCKSMITH_SANITIZE = 'blocksmith.sanitize';

export default function BlocksmithPlugin(props) {
  const { name = 'blocks', isVisible = false } = props;
  const formContext = useFormContext();
  const { editMode, form, pbj } = formContext;
  const [editor] = useLexicalComposerContext();
  const initialValueRef = useRef(null);
  const isVisibleRef = useRef(isVisible);
  isVisibleRef.current = isVisible;

  useEffect(() => {
    if (!editor.hasNodes([BlocksmithNode])) {
      throw new Error('BlocksmithPlugin: BlocksmithNode not registered on editor');
    }

    const checkDirtyOnBlurListener = () => {
      if (form.getState().submitting) {
        // if a user clicks the save button immediately after an edit
        // on blocksmith this listener would potentially change
        // the value of the field wiping out whatever beforeSubmit did.
        return;
      }

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
      editor.registerCommand(INSERT_BLOCK_COMMAND, (payload) => {
        const { newPbj = null, afterNodeKey = null } = payload;
        let $node;
        let selectMethod;
        if (!newPbj) {
          $node = $createParagraphNode();
          selectMethod = 'select';
        } else {
          const curie = newPbj.schema().getCurie().toString();
          $node = $createBlocksmithNode(curie, newPbj.toObject());
          selectMethod = 'selectEnd';
        }

        if (afterNodeKey) {
          const $target = $getNodeByKey(afterNodeKey);
          if ($target) {
            $target.insertAfter($node);
            $node[selectMethod]();
            return true;
          }
        }

        const selection = $getSelection();
        if (selection) {
          const $selectedNode = getSelectedNode(selection);
          try {
            const $nearestBlock = $getNearestBlockElementAncestorOrThrow($selectedNode);
            $nearestBlock.insertAfter($node);
            $node[selectMethod]();
            return true;
          } catch (e) {
          }
        }

        const $root = $getRoot();
        $root.append($node);
        $node[selectMethod]();
        return true;
      }, COMMAND_PRIORITY_EDITOR),
      editor.registerCommand(REMOVE_BLOCK_COMMAND, (nodeKey) => {
        const $node = $getNodeByKey(nodeKey);
        if ($node) {
          $node.remove();
        }
        return true;
      }, COMMAND_PRIORITY_EDITOR),
      editor.registerCommand(REPLACE_BLOCK_COMMAND, (payload) => {
        const { nodeKey, newPbj } = payload;
        const $node = $getNodeByKey(nodeKey);
        if ($node) {
          const curie = newPbj.schema().getCurie().toString();
          $node.replace($createBlocksmithNode(curie, newPbj.toObject()));
        }
        return true;
      }, COMMAND_PRIORITY_EDITOR),
      editor.registerCommand(PASTE_COMMAND, () => {
        setTimeout(() => {
          sanitizeNodes(editor);
        });
        return false;
      }, COMMAND_PRIORITY_HIGH),
    );
  }, [editor]);

  useEffect(() => {
    editor.setEditable(editMode);
  }, [editMode]);

  // when in view mode, we don't want a user to accidentally
  // get taken away if clicking on a link within blocksmith
  useEffect(() => {
    if (!editor || editMode) {
      return;
    }

    return editor.registerNodeTransform(LinkNode, ($node) => {
        if (!$node) {
          return;
        }

        if ($node.__target === '_blank') {
          return;
        }

        $node.setTarget('_blank');
      }
    );
  }, [editor, editMode]);

  useEffect(() => {
    if (!pbj) {
      return;
    }

    if (!formContext.delegate.shouldReinitialize) {
      return;
    }

    setTimeout(() => {
      const blocks = pbj.get(name, []);
      const top = getScrollTop();
      blocksToEditor(blocks, editor);
      initialValueRef.current = blocks.length > 0 ? blocks.map(b => marshalToFinalForm(b.toObject())) : undefined;
      form.registerField(name, noop, {}, {
        isEqual: areBlocksEqual,
        initialValue: initialValueRef.current,
        beforeSubmit: () => {
          const blocks = editorToBlocks(editor);
          const newValue = blocks.length > 0 ? blocks : undefined;
          if (!areBlocksEqual(newValue, initialValueRef.current)) {
            form.change(name, newValue);
          }
        }
      });
      if (isVisibleRef.current) {
        scrollToTop('auto', top);
      }
    });
  }, [pbj]);

  return null;
}
