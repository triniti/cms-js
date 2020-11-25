import { ContentState, EditorState } from 'draft-js';
import convertToCanvasBlocks from './convertToCanvasBlocks';
import convertToEditorState from './convertToEditorState';

/**
 * @param {EditorState} editorState
 *
 * @returns {Object}
 */
export default (editorState) => {
  const blocks = [];
  const errors = {};
  const validCanvasBlocks = [];
  let isValid = true;
  editorState.getCurrentContent().getBlockMap().forEach((block) => {
    const singleBlockEditorState = EditorState.push(
      EditorState.createEmpty(),
      ContentState.createFromBlockArray([block]),
    );
    try {
      const [canvasBlock] = convertToCanvasBlocks(singleBlockEditorState, true);
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
      });
      errors[block.getKey()] = {
        block,
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
