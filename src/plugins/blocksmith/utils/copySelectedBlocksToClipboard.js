import { ContentState, EditorState } from 'draft-js';
import copyToClipboard from '@triniti/cms/utils/copyToClipboard';
import { tokens } from '../constants';
import convertToCanvasBlocks from './convertToCanvasBlocks';
import getSelectedBlocksList from './getSelectedBlocksList';

export default (editorState) => {
  const newEditorState = EditorState.push(
    EditorState.createEmpty(),
    ContentState.createFromBlockArray(getSelectedBlocksList(editorState).toArray()),
  );
  copyToClipboard(`${tokens.BLOCKSMITH_COPIED_CONTENT_TOKEN}[${convertToCanvasBlocks(newEditorState).reduce((acc, cur) => `${acc.length ? `${acc},` : ''}${cur.toString()}`, '')}]`);
};
