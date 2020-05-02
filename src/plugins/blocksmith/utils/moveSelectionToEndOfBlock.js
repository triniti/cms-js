import { EditorState } from 'draft-js';

export default (editorState, currentBlock) => {
  const key = currentBlock.getKey();
  const length = currentBlock.getLength();

  return EditorState.forceSelection(editorState, editorState.getSelection().merge({
    anchorKey: key,
    anchorOffset: length,
    focusKey: key,
    focusOffset: length,
  }));
};