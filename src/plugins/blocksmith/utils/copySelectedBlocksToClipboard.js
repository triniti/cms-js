import { ContentState, EditorState } from 'draft-js';
import copyToClipboard from '@triniti/cms/utils/copyToClipboard';
import { tokens } from '../constants';
import convertToCanvasBlocks from './convertToCanvasBlocks';
import getSelectedBlocksList from './getSelectedBlocksList';

export default (editorState) => {
  let newEditorState = EditorState.createEmpty();
  newEditorState = EditorState.push(
    newEditorState,
    editorState.getCurrentContent(),
  );
  const selectedBlocks = getSelectedBlocksList(editorState);
  const newContentState = ContentState.createFromBlockArray(selectedBlocks.toArray());
  newEditorState = EditorState.push(
    newEditorState,
    newContentState,
  );
  copyToClipboard(`${tokens.BLOCKSMITH_COPIED_CONTENT_TOKEN}[${convertToCanvasBlocks(newEditorState).reduce((acc, cur) => `${acc.length ? `${acc},` : ''}${cur.toString()}`, '')}]`);
};
