import { useEffect } from 'react';
import { $getRoot, $insertNodes, COMMAND_PRIORITY_EDITOR, createCommand } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import BlocksmithNode, {
  $createBlocksmithNode,
  $isBlocksmithNode
} from '@triniti/cms/blocksmith/nodes/BlocksmithNode.js';
import nodeToHtml from '@triniti/cms/blocksmith/utils/nodeToHtml.js';
import htmlToNode from '@triniti/cms/blocksmith/utils/htmlToNode.js';
import { useFormContext } from '@triniti/cms/components/index.js';

export const INSERT_BLOCKSMITH_BLOCK_COMMAND = createCommand();
export const BLOCKSMITH_DIRTY_SYMBOL = Symbol('BLOCKSMITH_DIRTY');

export default function BlocksmithPlugin(props) {
  const { name = 'blocks', delegateRef } = props;
  const TextBlockV1 = delegateRef.current.TextBlockV1;
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
      validate: (value) => {
        console.log('blocksmith.validate', name, value);
      },
      beforeSubmit: () => {
        const editorState = editor.getEditorState();

        const blocks = [];
        editorState.read(() => {
          const nodes = $getRoot().getChildren();
          for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if ($isBlocksmithNode(node)) {
              blocks.push(node.exportJSON().__pbj);
            } else {
              const html = nodeToHtml(editor, node);
              if (html) {
                blocks.push(TextBlockV1.create().set('text', html).toObject());
              }
            }
          }
        });

        form.change('blocks', blocks);
      }
    });

    editor.update(() => {
      const parser = new DOMParser();
      const nodes = [];
      for (const block of pbj.get('blocks', [])) {
        const curie = block.schema().getCurie();
        if (curie.getMessage() === 'text-block') {
          const dom = parser.parseFromString(block.get('text'), 'text/html');
          nodes.push(...htmlToNode(editor, dom));
        } else {
          nodes.push($createBlocksmithNode(curie.toString(), block.toObject()));
        }
      }

      $getRoot().clear().select();
      $insertNodes(nodes);
    }, { discrete: true });

    return () => {
      unsubscribe();
    };
  }, [pbj]);

  return null;
}
