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

export default function BlocksmithPlugin(props) {
  const { beforeSubmitRef, delegateRef, field } = props;
  const formContext = useFormContext();
  const { editMode, form, node } = formContext;
  const [editor] = useLexicalComposerContext();
  const TextBlockV1 = delegateRef.current.TextBlockV1;

  useEffect(() => {
    if (!editor.hasNodes([BlocksmithNode])) {
      throw new Error('BlocksmithPlugin: BlocksmithNode not registered on editor');
    }

    // just want to keep track of dirty whenever editor changes
    delegateRef.current.handleChange = (editorState) => {
      console.log('editorState', JSON.stringify(editorState.toJSON()));
      form.change('blocks', []);
    };

    // final form beforeSubmit on the "blocks" field.
    // this is where we convert lexical the final form (pbj) format
    beforeSubmitRef.current = () => {
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
    };

    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString('<p>test <strong>wtf</strong></p>', 'text/html');
      const nodes = htmlToNode(editor, dom);
      $getRoot().clear().select();
      $insertNodes(nodes);
    }, { discrete: true });

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
