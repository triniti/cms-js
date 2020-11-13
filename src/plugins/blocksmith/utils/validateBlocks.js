import { ContentState, EditorState } from 'draft-js';
import convertToCanvasBlocks from './convertToCanvasBlocks';
import convertToEditorState from './convertToEditorState';

export default (editorState) => {
  const validCanvasBlocks = [];
  let wasValid = true;
  editorState.getCurrentContent().getBlockMap().forEach((block) => {
    const singleBlockEditorState = EditorState.push(
      EditorState.createEmpty(),
      ContentState.createFromBlockArray([block]),
    );
    try {
      const [canvasBlock] = convertToCanvasBlocks(singleBlockEditorState);
      validCanvasBlocks.push(canvasBlock);
    } catch (e) {
      wasValid = false;
      console.log(`[ERROR:Blocksmith:util:validateBlocks] - ${e}`);
    }
  });
  return {
    editorState,
    validCanvasBlocks,
    validEditorState: EditorState.push(
      editorState,
      convertToEditorState(validCanvasBlocks).getCurrentContent(),
    ),
    wasValid,
  };
};
