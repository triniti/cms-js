import { ContentState, EditorState } from 'draft-js';
import convertToCanvasBlocks from './convertToCanvasBlocks';
import convertToEditorState from './convertToEditorState';

export default (editorState) => {
  const blocks = [];
  const errors = {};
  const validCanvasBlocks = [];
  let isValid = true;
  let index = -1;
  editorState.getCurrentContent().getBlockMap().forEach((block) => {
    index += 1;
    const singleBlockEditorState = EditorState.push(
      EditorState.createEmpty(),
      ContentState.createFromBlockArray([block]),
    );
    try {
      const [canvasBlock] = convertToCanvasBlocks(singleBlockEditorState, true);
      if (canvasBlock.schema().getId().getCurie().getMessage() === 'video-block') {
        throw new Error('oh no');
      }
      validCanvasBlocks.push(canvasBlock);
      blocks.push({
        block: canvasBlock,
      });
    } catch (e) {
      isValid = false;
      console.error(`[ERROR:Blocksmith:util:validateBlocks] - Block: ${block.toString()} - ${e}`);
      blocks.push({
        block,
        error: e.stack,
        index,
      });
      // the block keys seem like they would be a good way to track which blocks have errors but
      // they change constantly so we have to use the index and make sure it stays up to date
      errors[index] = {
        key: block.getKey(),
        error: e.stack,
      };
    }
  });
  return {
    blocks,
    errors,
    isValid,
    validEditorState: EditorState.push(
      editorState,
      convertToEditorState(validCanvasBlocks).getCurrentContent(),
    ),
  };
};
